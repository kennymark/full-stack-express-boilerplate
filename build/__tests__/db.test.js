"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.env.NODE_ENV = 'test';
mongoose_1.default.connect(process.env.DB_URL, { useNewUrlParser: true });
describe('Test database activities', () => {
    beforeAll(() => {
        // console.log(db.modelNames())
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        yield mongoose_1.default.connection.dropCollection('nothing');
    }));
    test('should connection successfully to the db', () => __awaiter(void 0, void 0, void 0, function* () {
        const dbState = yield mongoose_1.default.connection.readyState;
        expect(dbState).toBe(2);
    }));
    test('should disconnect ', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close().then(_ => {
            const dbState = mongoose_1.default.connection.readyState;
            expect(dbState).toBe(0);
        });
    }));
    // test('should create a collection', () => {
    //   const models = db.modelNames()
    //   expect(models.length).toBeGreaterThan(1)
    // })
});
