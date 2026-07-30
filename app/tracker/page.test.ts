import { describe, expect, test, jest } from "@jest/globals";
import { fetchData } from "./page";

describe("fetchData", () => {
  test("возвращает список заявок из ответа сервера", async () => {
    const fakeApplications = [
      { id: 1, name: "Test Company", title: "Frontend Dev", status: "APPLIED" },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeApplications),
      }),
    ) as unknown as typeof fetch;

    const result = await fetchData();
    expect(result).toEqual(fakeApplications);
  });
});
