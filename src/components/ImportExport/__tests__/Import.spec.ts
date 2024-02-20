import { describe, it, expect } from 'vitest'
import { isCategory, tryParseTextIntoCategories } from '../Import.vue';

describe('Import helper: isCategory', () => {
  it('Gives true when given a primitive', () => {
    const result = isCategory(3) || isCategory("") || isCategory(true);
    expect(result).toBe(false);
  });
  it('Gives true when given a category with an empty transactions array', () => {
    const result = isCategory({ "id": 0, "name": "g", "color": "#ff6600", "icon": "mdi-help", "transactions": [] });
    expect(result).toBe(true);
  });
  it('Gives false when given a category with an invalid transactions property', () => {
    const result = isCategory({ "id": 0, "name": "g", "color": "#ff6600", "icon": "mdi-help", "transactions": [{}] });
    expect(result).toBe(false);
  });
});

describe("Import helper: tryParseTextIntoCategories", () => {
  it('Gives error message when given non-array strings', () => {
    const result = tryParseTextIntoCategories("3");
    expect("errorMessage" in result && result?.errorMessage).toEqual("not an array")
  });
  it('Gives error message when given non-json strings', () => {
    const result = tryParseTextIntoCategories("{");
    expect("errorMessage" in result && result?.errorMessage).toEqual("not a json")
  });
  it('Gives error message when string of array with invalid category', () => {
    const result = tryParseTextIntoCategories('[{ "id": 0, "name": "g", "color": "#ff6600", "icon": "mdi-help", "transactions": [{}] }]');
    expect("errorMessage" in result && result?.errorMessage).toContain("is not a valid category")
  });
  it('Gives data when given an empty array', () => {
    const result = tryParseTextIntoCategories("[]");
    expect(result).toHaveProperty("data");
  });
  it('Gives data when given a string with an array with a single, empty category', () => {
    const result = tryParseTextIntoCategories('[{ "id": 0, "name": "g", "color": "#ff6600", "icon": "mdi-help", "transactions": [] }]');
    expect(result).toHaveProperty("data");
  });
})