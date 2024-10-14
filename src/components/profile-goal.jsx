import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { api } from "@/modules/api.module"; // API 호출 모듈

export default function GoalSettingComponent() {
  const [goal, setGoal] = useState(""); // 선택한 목표 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [currentGoal, setCurrentGoal] = useState(""); // 현재 저장된 목표
  const router = useRouter();

  // 목표 값과 문자열을 한글로 변환하는 객체
  const goalTranslations = {
    weightdecrease: "체중 감소",
    weightkeep: "체중 유지",
    weightincrease: "체중 증가",
    healthkeep: "건강 유지",
    others: "그 외 기타",
  };

  // 목표를 불러오는 함수 (GET 요청)
  const fetchCurrentGoal = async () => {
    try {
      const response = await api.get("/member/info"); // GET 요청으로 회원 정보 가져오기
      if (response?.result === "success") {
        setCurrentGoal(response.data.goal); // 현재 목표를 상태에 저장
      }
    } catch (error) {
      console.error("현재 목표 불러오기 실패:", error);
      alert("목표를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    fetchCurrentGoal(); // 페이지 로드 시 기존 목표 불러오기
  }, []);

  const handleGoalSelection = (selectedGoal) => {
    setGoal(selectedGoal); // 선택한 목표를 상태에 저장
  };

  // 선택된 목표를 서버에 저장하는 함수 (PATCH 요청)
  const handleSave = async () => {
    if (!goal) {
      alert("목표를 선택하세요.");
      return;
    }

    try {
      setLoading(true); // 저장 시 로딩 시작

      const response = await api.patch("/member/editGoal", { goal }); // PATCH 요청으로 목표 저장

      if (response?.result !== "success") {
        throw new Error("목표 저장에 실패했습니다.");
      }

      alert("목표가 성공적으로 저장되었습니다.");

      // 서버에서 최신 정보를 다시 불러와서 goal 값을 확인
      await fetchCurrentGoal(); // 목표가 제대로 반영되었는지 다시 불러오기

      // 목표가 정상적으로 저장된 경우, edit 페이지로 이동
      router.push("/member/profile/edit"); // 쿼리 파라미터로 목표 정보 전달하지 않고 이동만
    } catch (error) {
      console.error("목표 저장 중 오류 발생:", error);
      alert("목표 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false); // 저장 완료 후 로딩 종료
    }
  };

  return (
    <>
      <CardTitle className="mb-16">목표가 무엇인가요?</CardTitle>
      <CardTitle className="mb-16 text-sm">
        현재 설정된 목표: {goalTranslations[currentGoal] || "설정된 목표 없음"}
      </CardTitle>

      <Card className="w-full border-0">
        <CardContent className="grid gap-4">
          <div className="grid gap-6">
            <Button
              variant="outline"
              className={`w-full shadow ${goal === "weightdecrease" ? "bg-black text-white" : "bg-white"}`}
              onClick={() => handleGoalSelection("weightdecrease")}
              style={{ height: "3.5rem" }}
            >
              체중 감소
            </Button>
            <Button
              variant="outline"
              className={`w-full shadow ${goal === "weightkeep" ? "bg-black text-white" : "bg-white"}`}
              onClick={() => handleGoalSelection("weightkeep")}
              style={{ height: "3.5rem" }}
            >
              체중 유지
            </Button>
            <Button
              variant="outline"
              className={`w-full shadow ${goal === "weightincrease" ? "bg-black text-white" : "bg-white"}`}
              onClick={() => handleGoalSelection("weightincrease")}
              style={{ height: "3.5rem" }}
            >
              체중 증가
            </Button>
            <Button
              variant="outline"
              className={`w-full shadow ${goal === "healthkeep" ? "bg-black text-white" : "bg-white"}`}
              onClick={() => handleGoalSelection("healthkeep")}
              style={{ height: "3.5rem" }}
            >
              건강 유지
            </Button>
            <Button
              variant="outline"
              className={`w-full shadow ${goal === "others" ? "bg-black text-white" : "bg-white"}`}
              onClick={() => handleGoalSelection("others")}
              style={{ height: "3.5rem" }}
            >
              그 외 기타
            </Button>
          </div>
        </CardContent>

        <CardFooter className="mt-6">
          <Button
            variant="solid"
            className="w-full bg-green-600 text-white"
            onClick={handleSave}
            disabled={!goal || loading} // 목표 선택과 로딩 상태에 따라 버튼 비활성화
          >
            {loading ? "저장 중..." : "저장"} {/* 로딩 중이면 텍스트 변경 */}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
