from seleniumwire import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import json
import time

TARGET_URL = "https://example.com/dashboard"
API_KEYWORDS = ["api", "v1", "graphql", "rest"]

def capture_all_data(url):
    print(f"[*] بدء تحميل الصفحة: {url}")

    # إعدادات seleniumwire (تعمل مع الفرع المُصان)
    options = {
        'disable_encoding': True,
        'request_storage': 'memory',
        'request_storage_max_size': 100
    }

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        seleniumwire_options=options
    )

    driver.get(url)

    # انتظار تحميل المحتوى الديناميكي (زِد القيمة حسب الحاجة)
    print("[*] في انتظار تحميل الصفحة والطلبات...")
    time.sleep(5)

    api_responses = []
    all_requests = []

    print("[*] تحليل طلبات الشبكة...")
    for request in driver.requests:
        if request.response:
            req_info = {
                "url": request.url,
                "method": request.method,
                "headers": dict(request.headers),
                "body": request.body.decode('utf-8', errors='ignore') if request.body else None,
            }
            res_info = {
                "status": request.response.status_code,
                "headers": dict(request.response.headers),
                "body": request.response.body.decode('utf-8', errors='ignore') if request.response.body else None,
            }
            all_requests.append({"request": req_info, "response": res_info})

            is_api = any(kw in request.url.lower() for kw in API_KEYWORDS)
            content_type = request.response.headers.get('Content-Type', '')
            if 'application/json' in content_type or 'application/graphql' in content_type:
                is_api = True

            if is_api:
                try:
                    json_data = json.loads(res_info['body'])
                    api_responses.append({
                        "url": request.url,
                        "method": request.method,
                        "status": res_info['status'],
                        "data": json_data
                    })
                except json.JSONDecodeError:
                    api_responses.append({
                        "url": request.url,
                        "method": request.method,
                        "status": res_info['status'],
                        "data": res_info['body'][:1000] + "..."
                    })

    final_html = driver.page_source
    driver.quit()

    output = {
        "url": url,
        "final_html": final_html,
        "api_responses": api_responses,
        "all_requests": all_requests
    }

    with open("page_dump.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"[✓] تم حفظ البيانات في ملف page_dump.json")
    print(f"[✓] عدد ردود API التي تم العثور عليها: {len(api_responses)}")
    print(f"[✓] إجمالي الطلبات الملتقطة: {len(all_requests)}")

if __name__ == "__main__":
    capture_all_data(TARGET_URL)