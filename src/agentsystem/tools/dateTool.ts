import { tool, ToolInterface } from "@langchain/core/tools";
import { z } from "zod";

// 定义工具输入模式
const DateToolSchema = z.object({
  operation: z.enum(["current", "add_days", "subtract_days"]).default("current"),
  days: z.number().default(0).optional(),
});

// 独立的日期计算函数
async function calculateDate(input: z.infer<typeof DateToolSchema>): Promise<string> {
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
    } else if (operation === "subtract_days" && daysInt !== 0) {
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
  } catch (error) {
    console.error("日期工具错误:", error);
    return "日期计算失败，请重试";
  }
}

export function createDateTool(): ToolInterface {
  // 创建符合 LangChain 类型要求的工具
  return tool(
    calculateDate,
    {
      name: "get_current_date",
      description: "获取当前日期或计算日期偏移",
      schema: DateToolSchema,
    }
  );
}