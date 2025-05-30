import { Sequelize } from "sequelize";
import "dotenv/config"

const sequelize = new Sequelize(
    process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    }
)

export default sequelize