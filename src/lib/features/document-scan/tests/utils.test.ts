import { describe, expect, test } from "vitest";
import { getSuffix } from "../use-case/utilts";

describe("getSuffix", () => {
  test("get the word pdf from joebiden.pdf", () => {
    expect(getSuffix("joebiden.pdf")).toBe("pdf");
  });

  test("get the word docx from joebiden.docx", () => {
    expect(getSuffix("joebiden.docx")).toBe("docx");
  });

  test("get the word xml from joebiden.xml", () => {
    expect(getSuffix("joebiden.xml")).toBe("xml");
  });

  test("get the word html from joebiden.html", () => {
    expect(getSuffix("joebiden.html")).toBe("html");
  });

  test("to throw error on invalid file type like joebiden.js", () => {
    expect(() => getSuffix("joebiden.js")).toThrowError();
  });
});
