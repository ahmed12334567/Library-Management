const { swaggerSpec } = require("./config/swagger");

try {
  const pathKeys = Object.keys(swaggerSpec.paths || {});
  console.log("✅ Swagger configuration loaded successfully!");
  console.log(`📊 Total documented OpenAPI endpoints: ${pathKeys.length}`);
  console.log("📍 Documented paths:");
  pathKeys.forEach(p => console.log(`   - ${p}`));
  console.log("\n🏷️ Defined Tags:", swaggerSpec.tags.map(t => t.name).join(", "));
  console.log("🛡️ Defined Security Schemes:", Object.keys(swaggerSpec.components.securitySchemes).join(", "));
  console.log("📦 Defined Schemas:", Object.keys(swaggerSpec.components.schemas).join(", "));
} catch (err) {
  console.error("❌ Swagger generation error:", err);
  process.exit(1);
}
