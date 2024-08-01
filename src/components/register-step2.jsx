/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/QsCMfinFuZ6
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'
import { Chivo } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

chivo({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CardTitle, Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { setRegisterStep2Data } from "@/store/reducers/member.reducer";
import { useRouter } from "next/router";

export default function RegisterStep2Component() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [showempty, setShowempty] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.memberReducer);
  const router = useRouter();

  useEffect(() => {
    console.log(data);
    const { gender, age } = data.registerStep2;
    setGender(gender);
    setAge(age);
  }, [data]);

  const handleGender = (gender) => {
    setGender(gender);
  };

  const handleAge = (e) => {
    setAge(e.target.value);
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();

    router.push("/member/register/step1"); // Navigate to /member/register/step1
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gender || !age) {
      setShowempty(true);
      return;
    }

    dispatch(
      setRegisterStep2Data({
        gender,
        age,
      })
    );
    router.push("/member/register/step3"); // Navigate to /member/register/step3
  };

  return (
    <>
      <Progress value={30} className="w-full mb-8" />
      <CardTitle className="mb-16">성별과 나이를 알려주세요</CardTitle>
      <CardTitle className="mb-16 text-sm">
        정확한 식단 추천 및 분석을 위해 성별과 나이 정보가 필요합니다.
      </CardTitle>
      <Card className="w-full border-0 shadow-none">
        <CardContent className="grid gap-4">
          <div className="grid gap-16">
            <div className="space-y-2">
              <Label htmlFor="gender">성별</Label>
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  className={`w-1/2 ${
                    gender === "man" ? "bg-black text-white" : "bg-white"
                  }`}
                  onClick={(e) => {
                    handleGender("man");
                  }}
                >
                  남성
                </Button>
                <Button
                  variant="outline"
                  className={`w-1/2 ${
                    gender === "woman" ? "bg-black text-white" : "bg-white"
                  }`}
                  onClick={(e) => {
                    handleGender("woman");
                  }}
                >
                  여성
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">나이</Label>
              <Input
                id="age"
                type="number"
                value={age}
                min="0"
                max="120"
                className="h-20"
                placeholder="만 나이를 입력해주세요."
                onChange={(e) => handleAge(e)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-auto border-0 w-full">
        <Card className="w-full border-0 shadow-none">
          <CardFooter className="flex justify-between gap-2">
            <Button
              variant="outline"
              className="w-full border-0"
              onClick={handleSubmit2}
            >
              이전
            </Button>
            <Button
              type="submit"
              className="w-full border bg-black text-white"
              onClick={handleSubmit}
            >
              다음
            </Button>
          </CardFooter>
        </Card>
      </div>
      {showempty && (
        <p className="text-red-500 text-center">모든 항목을 입력해주세요.</p>
      )}
    </>
  );
}
