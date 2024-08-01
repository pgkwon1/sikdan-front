/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/PrqtjfIFBZc
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
import { Progress } from "@/components/ui/progress";
import { CardTitle, Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setRegisterStep3Data } from "@/store/reducers/member.reducer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RegisterStep3Component() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [showempty, setShowempty] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.memberReducer);
  const router = useRouter();

  useEffect(() => {
    const { height, weight } = data.registerStep3;

    setHeight(height);
    setWeight(weight);
  }, [data]);

  const handleHeight = (e) => {
    setHeight(e.target.value);
  };

  const handleWeight = (e) => {
    setWeight(e.target.value);
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();

    router.push("/member/register/step2"); // Navigate to /member/register/step2
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!height || !weight) {
      setShowempty(true);
      return;
    }
    dispatch(
      setRegisterStep3Data({
        height,
        weight,
      })
    );
    router.push("/member/register/step4"); // Navigate to /member/register/step4
  };
  return (
    <>
      <Progress value={60} className="w-full mb-8" />
      <CardTitle className="mb-16">키와 몸무게를 알려주세요</CardTitle>
      <CardTitle className="mb-16 text-sm">
        정확한 식단 추천 및 분석을 위해 성별과 나이 정보가 필요합니다.
      </CardTitle>
      <Card className="w-full border-0 shadow-none">
        <CardContent className="grid gap-4">
          <div className="grid gap-16">
            <div className="space-y-2">
              <Label htmlFor="height">키</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="height"
                  type="number"
                  // value={height}
                  min="0"
                  max="400"
                  placeholder="키를 입력해주세요."
                  className="shadow h-20 text-lg"
                  onChange={(e) => handleHeight(e)}
                  required
                />
                <span className="text-gray-500">cm</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">몸무게</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  max="300"
                  placeholder="몸무게를 입력해주세요."
                  onChange={(e) => handleWeight(e)}
                  className="shadow h-20 text-lg"
                  required
                />
                <span className="text-gray-500">kg</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-auto border-0 w-full">
        <Card className="w-full border-0 shadow-none">
          <CardFooter className="flex justify-between gap-2">
            <Button
              variant="outline"
              className="w-full border shadow"
              onClick={handleSubmit2}
            >
              이전
            </Button>
            <Button
              type="submit"
              className="w-full bg-black text-white shadow"
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
