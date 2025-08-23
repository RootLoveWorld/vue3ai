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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDateTool = createDateTool;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
// 定义工具输入模式
const DateToolSchema = zod_1.z.object({
    operation: zod_1.z.enum(["current", "add_days", "subtract_days"]).default("current"),
    days: zod_1.z.number().default(0).optional(),
});
// 独立的日期计算函数
function calculateDate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { operation, days } = input;
            // 验证参数
            if (typeof days !== "number" || isNaN(days)) {
                throw new Error(`无效的天数: ${days}`);
            }
            const daysInt = Math.floor(days);
            const now = new Date();
            let prefix = "当前日期: ";
            // 执行日期计算
            if (operation === "add_days" && daysInt !== 0) {
                now.setDate(now.getDate() + daysInt);
                prefix = `增加 ${daysInt} 天后: `;
            }
            else if (operation === "subtract_days" && daysInt !== 0) {
                now.setDate(now.getDate() - daysInt);
                prefix = `减少 ${daysInt} 天后: `;
            }
            // 格式化日期字符串
            return prefix + now.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
            });
        }
        catch (error) {
            console.error("日期工具错误:", error);
            return "日期计算失败，请重试";
        }
    });
}
function createDateTool() {
    // 创建符合 LangChain 类型要求的工具
    return (0, tools_1.tool)(calculateDate, {
        name: "get_current_date",
        description: "获取当前日期或计算日期偏移",
        schema: DateToolSchema,
    });
}
