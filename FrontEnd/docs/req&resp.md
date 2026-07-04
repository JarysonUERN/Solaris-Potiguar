USER REQUEST / RESPONSE + ROUTES

----------------------------------------------------
POST /SolarisPotiguar/login
----------------------------------------------------

Request
{
  email: string;
  password: string;
}

Ação
Validar credenciais.

Response
{
  token: string;
  email: "joao@gmail.com";
  full_name: "João Gomes";
}

----------------------------------------------------
POST /SolarisPotiguar/register
----------------------------------------------------

Request
{
  full_name: string;
  email: string;
  password: string;
  phone: string;
  has_whatsapp: boolean;
  cpf: string;
}

Ação
Registrar usuário.

Response
{
  id: 1;
  full_name: "João Gomes";
  email: "joao@gmail.com";
  phone: "(84) 99988-7766";
  has_whatsapp: true;
  cpf: "123.456.789-00";
}

----------------------------------------------------
GET /SolarisPotiguar/user
----------------------------------------------------

Ação
Retorna os dados do usuário autenticado.

Response
{
  id: 1;
  full_name: "João Gomes";
  email: "joao@gmail.com";
  phone: "(84) 99988-7766";
  has_whatsapp: true;
  cpf: "123.456.789-00";
}

----------------------------------------------------
PUT /SolarisPotiguar/user
----------------------------------------------------

Request
{
  full_name: string;
  phone: string;
  has_whatsapp: boolean;
}

Ação
Atualizar informações do usuário.

Response
{
  message: "User updated successfully.";
  user: {
    id: 1;
    full_name: "João Gomes";
    email: "joao@gmail.com";
    phone: "(84) 99988-7766";
    has_whatsapp: true;
  }
}

----------------------------------------------------
POST /SolarisPotiguar/onboarding
----------------------------------------------------

Request
{
  farm_name: string;

  city: string;

  operation_type:
    "irrigation" |
    "livestock" |
    "poultry" |
    "agroindustry" |
    "commerce" |
    "residential" |
    "other";

  installed_power_kwp: number;

  has_battery: boolean;

  battery_capacity_kwh: number;

  average_monthly_consumption_kwh: number;

  peak_consumption_period:
    "morning" |
    "afternoon" |
    "night";

  flexible_operation: boolean;

  main_equipments: string[];

  operation_description: string;
}

Ação
Cadastrar propriedade e configurar o perfil energético.

Response
{
  property_id: 1;
  message: "Property configured successfully.";
}

