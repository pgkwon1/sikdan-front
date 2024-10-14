import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { api } from "@/modules/api.module";
import { showToast } from "./layout/toast";
import Link from "next/link";

export default function FindIdComponent() {
  const [findData, setFindData] = useState({
    name: "",
    email: "",
  });

  const setData = (props, value) => {
    setFindData((current) => ({
      ...current,
      [props]: value,
    }));
  };

  const apiFindId = async () => {
    const isError = true;
    if (findData.email === "") {
      showToast("이름 또는 이메일을 입력해주세요.", isError);
    }
    const { name, email } = findData;
    const result = await api.post("/member/find_id", {
      name,
      email,
    });

    if (result.result === "success") {
      showToast("회원가입 때 입력하셨던 이메일로 아이디를 발송해드렸습니다.");
    } else {
      showToast(result.message, isError);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">아이디 찾기</h1>
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              onChange={(e) => setData("email", e.currentTarget.value)}
            />
          </div>
          <Button
            type="button"
            className="w-full bg-black text-white"
            onClick={apiFindId}
          >
            아이디 찾기
          </Button>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="font-medium underline" prefetch={false}>
              로그인
            </Link>
            {" | "}
            <Link
              href="/member/find-password"
              className="font-medium underline"
              prefetch={false}
            >
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
