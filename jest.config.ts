import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["<rootDir>/**/*.test.(js|ts)"], //조건에 맞는 파일만 실행시킬 정규식
  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/src/core/$1", //tsconfig에서 설정한 절대경로를 test시에도 사용할 수 있도록 함
  },
  testEnvironment: "node",
  verbose: true, // 콘솔 로그가 예쁘게 찍힌다고 함....
  preset: "ts-jest",
};

export default config;
