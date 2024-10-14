import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EditPasswordComponent from "./profile-editpassword";
import { api } from "@/modules/api.module";
import { showToast } from "./layout/toast";

export default function ProfileEditComponent() {
  const [info, setInfo] = useState({ nickname: "", email: "", userId: "" }); // 회원 정보 상태에 userId 추가
  const [allergy, setAllergy] = useState(false); // 알레르기 상태
  const [goal, setGoal] = useState(""); // 최신 목표를 반영하기 위해 빈 문자열로 초기화
  const [selectedAllergies, setSelectedAllergies] = useState([]); // 선택된 알레르기
  const [showPasswordPopup, setShowPasswordPopup] = useState(false); // 비밀번호 변경 팝업
  const router = useRouter();

  // 목표 값과 문자열을 한글로 변환하는 객체
  const goalTranslations = {
    weightdecrease: "체중 감소",
    weightkeep: "체중 유지",
    weightincrease: "체중 증가",
    healthkeep: "건강 유지",
    others: "그 외 기타",
  };

  const isError = true;

  // 회원 정보를 불러오는 함수 (GET 요청)
  const getInfo = async () => {
    try {
      const response = await api.get("/member/info"); // GET 요청으로 회원 정보 불러오기
      if (response?.result === "success") {
        const { age, height, weight, goal, allergy, nickname, email, userId } = response.data;

        // API로 받은 정보 설정
        setInfo({ age, height, weight, nickname, email, userId });
        setGoal(goal); // 서버로부터 목표를 받아 상태에 저장

        // 불러온 알레르기 데이터를 ','로 구분된 문자열에서 배열로 변환하여 상태에 설정
        const tmpAllergy = allergy ? allergy.split(",") : [];
        setSelectedAllergies(tmpAllergy);
        setAllergy(tmpAllergy.length > 0); // 알레르기 여부 상태 설정
      }
    } catch (error) {
      console.error("회원 정보를 불러오는 중 오류 발생:", error);
      showToast("회원 정보를 불러오는 중 오류가 발생했습니다.", isError);
    }
  };

  useEffect(() => {
    getInfo(); // 컴포넌트 마운트 시 회원 정보 불러오기

    // 목표 페이지에서 수정한 경우, 쿼리 파라미터에서 목표 가져오기
    const { goal: goalFromQuery } = router.query;
    if (goalFromQuery) {
      setGoal(goalFromQuery); // 쿼리 파라미터에서 가져온 목표로 상태 업데이트
    }

    // 디버깅용 데이터 확인
    console.log(info);
  }, [router.query]);

  // 회원 정보 수정 요청 함수 (PATCH 요청)
  const handleEditInfo = async () => {
    if (!info.height) {
      showToast("키를 입력해주세요.", isError);
      return false;
    }

    if (!info.weight) {
      showToast("몸무게를 입력해주세요.", isError);
      return false;
    }

    // 선택된 알레르기 배열을 ','로 구분된 문자열로 변환하여 서버에 전송
    const allergyString = selectedAllergies.length > 0 ? selectedAllergies : [];

    const { age, height, weight } = info;
    try {
      const response = await api.patch("/member/edit", {
        editData: { age, height, weight, allergy: allergyString, goal }, // 수정할 정보와 목표, 알레르기 정보 전송
      });

      if (response?.result === "success") {
        showToast("회원 정보가 수정되었습니다.", false);
        // 수정 후 정보 다시 불러오기
        await getInfo(); // 저장된 후 정보 불러오기
      } else {
        showToast("회원 정보 수정에 실패했습니다.", isError);
      }
    } catch (error) {
      console.error("회원 정보 수정 중 오류 발생:", error);
      showToast("회원 정보 수정 중 오류가 발생했습니다.", isError);
    }
  };

  // 토큰 기반 로그아웃 함수
  const handleLogout = () => {
    // 로컬 스토리지에서 인증 토큰 삭제
    localStorage.removeItem("authToken");

    // 성공 메시지 출력
    showToast("로그아웃 되었습니다.", false);

    // 로그인 페이지로 리다이렉트
    router.push("/");
  };

  // 알레르기 선택 핸들러
  const handleAllergySelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedAllergies((prev) => [...prev, value]); // 체크되면 알레르기 추가
    } else {
      setSelectedAllergies((prev) => prev.filter((allergy) => allergy !== value)); // 체크 해제 시 알레르기 제거
    }
  };

  // 알레르기 유무 라디오 버튼 핸들러
  const handleAllergyRadioChange = (hasAllergy) => {
    setAllergy(hasAllergy);
    if (!hasAllergy) {
      setSelectedAllergies([]); // '없음' 선택 시 모든 알레르기 초기화
    }
  };

  // 목표 설정 페이지로 이동
  const handleGoalSetting = () => {
    router.push("/member/profile/goal"); // 목표 설정 페이지로 이동
  };

  // 이전 페이지로 이동
  const handleExit = () => {
    router.back(); // 이전 페이지로 돌아가기
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 bg-white dark:bg-gray-950 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Avatar className="w-16 h-16 border-2 border-gray-300">
          <AvatarFallback>{info.nickname ? info.nickname.substring(0, 2) : "?"}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{info.nickname || "닉네임 없음"}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{info.userId || "아이디 없음"}</p>{" "}
          {/* 사용자 아이디 표시 */}
        </div>
        <Button variant="outline" className="ml-auto" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
      <Separator className="my-6" />
      <p className="mb-4 text-gray-700 dark:text-gray-300">수정하실 정보를 입력해주세요.</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            value={info.email || "이메일을 불러오는 중..."}
            className="mt-1 block w-full bg-gray-300"
            readOnly
            disabled
          />
        </div>
        <div className="flex justify-start">
          <Button
            variant="outline"
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            onClick={() => setShowPasswordPopup(!showPasswordPopup)}
          >
            비밀번호 변경
          </Button>
        </div>

        {showPasswordPopup && <EditPasswordComponent handlePasswordPopup={() => setShowPasswordPopup(false)} />}
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            키(cm)
          </label>
          <Input
            id="height"
            type="number"
            placeholder="키를 입력하세요."
            className="mt-1 block w-full"
            onChange={(e) => setInfo({ ...info, height: e.target.value })}
            value={info.height || ""}
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            몸무게(kg)
          </label>
          <Input
            id="weight"
            type="number"
            placeholder="몸무게를 입력하세요."
            className="mt-1 block w-full"
            onChange={(e) => setInfo({ ...info, weight: e.target.value })}
            value={info.weight || ""}
          />
        </div>

        {/* 알레르기 선택 영역 */}
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">알레르기 유무</span>
          <div className="flex items-center mt-2">
            <label className="flex items-center mr-4">
              <input
                type="radio"
                name="allergy"
                value="yes"
                checked={allergy}
                onChange={() => handleAllergyRadioChange(true)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">있음</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="allergy"
                value="no"
                checked={!allergy}
                onChange={() => handleAllergyRadioChange(false)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">없음</span>
            </label>
          </div>

          {allergy && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">알레르기 선택</label>
              <div className="mt-2 space-y-2">
                {[
                  "메밀",
                  "밀",
                  "대두",
                  "땅콩",
                  "호두",
                  "잣",
                  "아황산류",
                  "복숭아",
                  "토마토",
                  "난류",
                  "우유",
                  "새우",
                  "고등어",
                  "오징어",
                  "게",
                  "조개류",
                  "돼지고기",
                  "쇠고기",
                  "닭고기",
                ].map((allergyItem) => (
                  <label key={allergyItem} className="flex items-center">
                    <input
                      type="checkbox"
                      value={allergyItem}
                      checked={selectedAllergies.includes(allergyItem)}
                      onChange={handleAllergySelection}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{allergyItem}</span>
                  </label>
                ))}
              </div>

              {/* 선택된 알레르기 목록 표시 */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">선택된 알레르기:</h4>
                <div className="flex flex-wrap mt-2">
                  {selectedAllergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 현재 목표를 알레르기 하단에 위치 */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">현재 목표</h3>
          <p className="text-gray-600 dark:text-gray-400">{goalTranslations[goal] || "목표 없음"}</p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          onClick={handleEditInfo}
        >
          수정
        </Button>
        <Button
          variant="outline"
          className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          onClick={handleGoalSetting}
        >
          목표 설정
        </Button>
        <Button
          variant="outline"
          className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          onClick={handleExit}
        >
          나가기
        </Button>
      </div>
    </div>
  );
}
