"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportBatchEntity = void 0;
const typeorm_1 = require("typeorm");
const UserEnity_1 = require("./UserEnity");
const TransactionEntity_1 = require("./TransactionEntity");
let ImportBatchEntity = class ImportBatchEntity {
};
exports.ImportBatchEntity = ImportBatchEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ImportBatchEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ImportBatchEntity.prototype, "file_name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEnity_1.UserEntity, { nullable: true, onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "imported_by" }),
    __metadata("design:type", UserEnity_1.UserEntity)
], ImportBatchEntity.prototype, "importedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", default: () => "NOW()" }),
    __metadata("design:type", Date)
], ImportBatchEntity.prototype, "imported_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ImportBatchEntity.prototype, "record_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "pending" }),
    __metadata("design:type", String)
], ImportBatchEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], ImportBatchEntity.prototype, "error_message", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TransactionEntity_1.TransactionEntity, tx => tx.batch),
    __metadata("design:type", Array)
], ImportBatchEntity.prototype, "transactions", void 0);
exports.ImportBatchEntity = ImportBatchEntity = __decorate([
    (0, typeorm_1.Entity)("import_batches")
], ImportBatchEntity);
