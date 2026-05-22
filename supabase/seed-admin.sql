-- Depois de criar sua conta no site (/cadastro), torne-se administrador:
-- 1. Supabase → Authentication → Users → copie o UUID do seu usuário
-- 2. Substitua abaixo e execute no SQL Editor

-- insert into public.admin_users (user_id) values ('COLE_SEU_UUID_AQUI');

-- Ou, se souber seu e-mail:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'seu@email.com' limit 1;
