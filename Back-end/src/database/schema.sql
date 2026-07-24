--
-- PostgreSQL database dump
--

\restrict zNeftEO3B1ENvNtMeLh4npfeTPByGStrKCi9Ear1s7NaU4K3YRoxXhWLlbm3sef

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-24 23:45:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 229 (class 1255 OID 16511)
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_modified_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16523)
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title character varying(50) NOT NULL,
    author character varying(50) NOT NULL,
    isbn character varying(100) NOT NULL,
    price integer NOT NULL,
    stock integer NOT NULL,
    description text NOT NULL,
    categorie_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.books OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16522)
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.books ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16567)
-- Name: borrow_requset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borrow_requset (
    id integer NOT NULL,
    user_id integer NOT NULL,
    book_id integer NOT NULL,
    status character varying(10) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT borrow_requset_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Accept'::character varying, 'Rejected'::character varying])::text[])))
);


ALTER TABLE public.borrow_requset OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16566)
-- Name: borrow_requset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.borrow_requset ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.borrow_requset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 16550)
-- Name: borrowedbooks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borrowedbooks (
    id integer NOT NULL,
    user_id integer,
    book_id integer,
    borrow_date timestamp with time zone DEFAULT now() NOT NULL,
    return_date timestamp with time zone DEFAULT now() NOT NULL,
    status character varying(50) DEFAULT 'borrowed'::character varying NOT NULL,
    CONSTRAINT borrowedbooks_status_check CHECK (((status)::text = ANY ((ARRAY['borrowed'::character varying, 'returned'::character varying, 'late'::character varying])::text[])))
);


ALTER TABLE public.borrowedbooks OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16549)
-- Name: borrowedbooks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.borrowedbooks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.borrowedbooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16516)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16515)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16496)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(100),
    role character varying(50) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    google_user boolean,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'moderator'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16495)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4897 (class 2606 OID 16540)
-- Name: books books_isbn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);


--
-- TOC entry 4899 (class 2606 OID 16538)
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16576)
-- Name: borrow_requset borrow_requset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_requset
    ADD CONSTRAINT borrow_requset_pkey PRIMARY KEY (id);


--
-- TOC entry 4903 (class 2606 OID 16562)
-- Name: borrowedbooks borrowedbooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowedbooks
    ADD CONSTRAINT borrowedbooks_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 16521)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 16510)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4893 (class 2606 OID 16508)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4901 (class 1259 OID 16588)
-- Name: borrow_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX borrow_date ON public.borrowedbooks USING btree (borrow_date);


--
-- TOC entry 4900 (class 1259 OID 16589)
-- Name: created_at_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX created_at_index ON public.books USING btree (created_at);


--
-- TOC entry 4910 (class 2620 OID 16548)
-- Name: books update_books_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_books_modtime BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- TOC entry 4909 (class 2620 OID 16514)
-- Name: users update_users_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- TOC entry 4906 (class 2606 OID 16541)
-- Name: books books_categorie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_categorie_id_fkey FOREIGN KEY (categorie_id) REFERENCES public.categories(id);


--
-- TOC entry 4907 (class 2606 OID 16582)
-- Name: borrow_requset borrow_requset_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_requset
    ADD CONSTRAINT borrow_requset_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- TOC entry 4908 (class 2606 OID 16577)
-- Name: borrow_requset borrow_requset_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_requset
    ADD CONSTRAINT borrow_requset_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-07-24 23:45:22

--
-- PostgreSQL database dump complete
--

\unrestrict zNeftEO3B1ENvNtMeLh4npfeTPByGStrKCi9Ear1s7NaU4K3YRoxXhWLlbm3sef

