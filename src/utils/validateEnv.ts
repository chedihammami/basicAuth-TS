import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_DB: str(), 
        PORT: port({ default: 3001 }),
        JWT_SECRET: str()
    });
}

export default validateEnv;
