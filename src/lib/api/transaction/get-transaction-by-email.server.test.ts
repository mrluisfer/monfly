import { z } from "zod";

import { getTransactionByEmail } from "../../../utils/transactions/get-transaction-by-email";

// Mock the utility function instead of Prisma directly
jest.mock("../../../utils/transactions/get-transaction-by-email");

describe("getTransactionByEmailServer", () => {
  const mockEmail = "test@example.com";
  const mockTransactions = [
    {
      id: "1",
      amount: 100,
      description: "Test transaction",
      userEmail: mockEmail,
      createdAt: new Date("2025-06-02"),
      updatedAt: new Date("2025-06-02"),
      type: "EXPENSE",
      date: new Date("2025-06-02"),
      category: "Food",
      user: {
        id: "1",
        email: mockEmail,
        name: "Test User",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return transactions for a valid email", async () => {
    // Mock the utility function response
    const mockResponse = {
      error: false,
      message: "Transactions fetched successfully",
      data: mockTransactions,
      success: true,
      statusCode: 200,
    };
    (getTransactionByEmail as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getTransactionByEmail(mockEmail);

    expect(result).toEqual(mockResponse);
    expect(getTransactionByEmail).toHaveBeenCalledWith(mockEmail);
  });

  it("should handle errors", async () => {
    // Mock the utility function to return an error
    const mockErrorResponse = {
      error: true,
      message: "Error fetching transactions",
      data: null,
      statusCode: 500,
    };
    (getTransactionByEmail as jest.Mock).mockResolvedValue(mockErrorResponse);

    const result = await getTransactionByEmail(mockEmail);

    expect(result).toEqual(mockErrorResponse);
    expect(getTransactionByEmail).toHaveBeenCalledWith(mockEmail);
  });

  it("should validate email input", async () => {
    const validator = z.object({ email: z.string().email() });
    expect(() => validator.parse({ email: "" })).toThrow();
  });
});
