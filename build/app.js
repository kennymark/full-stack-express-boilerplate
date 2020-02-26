"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const express_session_1 = __importDefault(require("express-session"));
const express_validator_1 = __importDefault(require("express-validator"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const method_override_1 = __importDefault(require("method-override"));
require("./controllers/auth.controller"); //runs passport authentication 
const config_1 = __importDefault(require("./config/config"));
const util_1 = require("./config/util");
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const app = express_1.default();
const port = process.env.PORT || 3000;
//@ts-ignore
mongoose_1.default.connect(process.env.DB_URL, config_1.default.dbOptions);
mongoose_1.default.connection.on('error', error => console.log(error));
app.use(cors_1.default());
app.use(method_override_1.default('_method'));
app.use(compression_1.default());
app.use(helmet_1.default());
app.use(express_session_1.default(config_1.default.sessionConfig));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.enable('trust proxy');
//view-engine config
app.set('view engine', 'hbs');
app.engine('hbs', express_handlebars_1.default(config_1.default.hbsConfig));
app.set('views', path_1.default.join(__dirname, '../views'));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(connect_flash_1.default());
app.use(express_validator_1.default());
app.use(util_1.setLocals);
app.use(util_1.logger);
// routes
app.use('/', index_routes_1.default);
app.use('/account', user_routes_1.default);
//error 404
app.get('*', (req, res) => res.status(404).render('error404', { data: req.originalUrl }));
app.listen(port), () => console.log(`Listening at http://localhost:${port}`);
exports.default = app;
