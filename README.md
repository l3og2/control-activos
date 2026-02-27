💻 Sistema de Control de Activos Tecnológicos
Este es un proyecto académico desarrollado para la gestión y control de inventario de hardware. Permite llevar el registro de empleados, categorías de equipos, activos físicos, asignaciones y mantenimientos.

🚀 Tecnologías Utilizadas
Entorno de Ejecución: Node.js (corriendo en WSL2/Ubuntu)

Framework Backend: Express.js

Base de Datos: MongoDB (NoSQL)

Modelado de Datos: Mongoose (ODM)

Pruebas de API: REST Client / Postman

🛠️ Instalación y Configuración
1. Clonar el repositorio:

git clone <url-de-tu-repo>
cd control-activos

2. Instalar dependencias:

npm install

3. Configurar variables de entorno:
Crea un archivo .env en la raíz y agrega tu URI de MongoDB:

PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/control_activos

4. Poblar la Base de Datos (Seeding):
Para cargar los datos iniciales de prueba (4 documentos por colección), ejecuta:

node seed.js

5. Iniciar el servidor:

node index.js

📂 Estructura de la Base de Datos
El sistema cuenta con 5 colecciones relacionadas:

empleados: Datos del personal.

categorias: Clasificación de equipos (Laptops, Monitores, etc.).

activos: El hardware físico vinculado a una categoría.

asignaciones: Registro de qué empleado tiene qué activo.

mantenimientos: Historial de reparaciones y costos.


Método,Endpoint,Descripción
GET,/api/activos,Obtener todos los activos (con populate)
GET,/api/activos/:id,Obtener detalle de un activo por ID
GET,/api/activos/estado/:estado,Consulta Especial: Filtrar por estado
POST,/api/activos,Registrar un nuevo activo
PUT,/api/activos/:id,Actualizar datos de un activo
DELETE,/api/activos/:id,Eliminar un activo del sistema


Método	Endpoint	Descripción
GET	/api/activos	Obtener todos los activos (con populate)
GET	/api/activos/:id	Obtener detalle de un activo por ID
GET	/api/activos/estado/:estado	Consulta Especial: Filtrar por estado
POST	/api/activos	Registrar un nuevo activo
PUT	/api/activos/:id	Actualizar datos de un activo
DELETE	/api/activos/:id	Eliminar un activo del sistema
