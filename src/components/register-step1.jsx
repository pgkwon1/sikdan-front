import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setRegisterStep1Data } from "@/store/reducers/member.reducer";
import { useRouter } from "next/router";
import { showToast } from "./layout/toast";
import { api } from "@/modules/api.module";
import ArrowLeftIcon from "./icon/arrowlefticon";

export default function RegisterStep1Component() {
  const [userId, setUserid] = useState("");
  const [isidavailable, setIsidavailable] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isnicknameavailable, setIsnicknameavailable] = useState(true);
  const [email, setEmail] = useState("");
  const [trainer_yn, setTrainer_yn] = useState("");

  const duplicateRef = useRef({
    userId: null,
    nickname: null,
    email: null,
  });
  const [duplicateCheck, setDuplicateCheck] = useState({
    userId: false,
    nickname: false,
    email: false,
  });
  const dispatch = useDispatch();
  const data = useSelector((state) => state.memberReducer);
  const router = useRouter();
  const isError = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const { userId, nickname, email, trainer_yn } = data.registerStep1;
    setUserid(userId);
    setNickname(nickname);
    setEmail(email);
    setTrainer_yn(trainer_yn);
  }, [data]);

  const handleUserId = (e) => {
    setDuplicateCheck((current) => ({
      ...current,
      userId: false,
    }));
    setUserid(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleNickname = (e) => {
    setDuplicateCheck((current) => ({
      ...current,
      nickname: false,
    }));
    setNickname(e.target.value);
  };

  const handleEmail = (e) => {
    setDuplicateCheck((current) => ({
      ...current,
      email: false,
    }));

    setEmail(e.target.value);
  };

  const handleTrainer_yn = (type) => {
    setTrainer_yn(type);
  };

  // 중복 검사
  const handleDuplicate = async (type, data) => {
    if (type === "email" && emailRegex.test(email) === false) {
      showToast("올바른 이메일을 입력해주세요.", isError);
      return false;
    }
    const response = await api.post(`/member/register/duplicate`, {
      type,
      data,
    });
    let result = false;
    if (response.result === "success") {
      result = true;

      duplicateRef.current[type].classList.remove("bg-red-200");
      showToast("사용 가능합니다.");
    } else {
      let message = "";
      if (type === "userId") {
        message = "이미 사용중인 아이디 입니다.";
      } else if (type === "nickname") {
        message = "이미 사용중인 닉네임 입니다.";
      } else if (type === "email") {
        message = "이미 사용중인 이메일 입니다.";
      }
      duplicateRef.current[type].classList.add("bg-red-200");
      showToast(message, isError);
    }

    setDuplicateCheck((current) => ({
      ...current,
      [type]: result,
    }));
  };

  // 비밀번호 재확인
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !userId ||
      !password ||
      !confirmpassword ||
      !nickname ||
      !email ||
      !trainer_yn
    ) {
      showToast("모든 항목을 입력해주세요.", isError);
      return;
    }

    if (duplicateCheck.userId === false) {
      showToast("아이디 중복검사를 진행해주세요", isError);
      return false;
    }

    if (password !== confirmpassword) {
      showToast("비밀번호가 일치하지 않습니다.", isError);
      return false;
    }

    if (duplicateCheck.nickname === false) {
      showToast("닉네임 중복검사를 진행해주세요", isError);
      return false;
    }

    if (emailRegex.test(email) === false) {
      showToast("올바른 이메일을 입력해주세요.", isError);
      return false;
    }

    if (duplicateCheck.email === false) {
      showToast("이메일 중복검사를 진행해주세요", isError);
      return false;
    }

    dispatch(
      setRegisterStep1Data({
        userId,
        password,
        nickname,
        email,
        trainer_yn,
      })
    );
    router.push("/member/register/step2"); // Navigate to /member/register/step2
  };

  return (
    <>
      <button
        onClick={() => router.push("/")} // 뒤로 가기 기능
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-300"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      <div className="w-full space-y-6">
        <div className="text-center" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userid">아이디</Label>
            <div className="flex gap-2">
              <Input
                id="userid"
                type="text"
                className="shadow"
                value={userId}
                placeholder="사용하실 아이디를 입력해주세요."
                onChange={(e) => handleUserId(e)}
                ref={(el) => (duplicateRef.current.userId = el)}
                required
              />
              <Button
                variant="outline"
                className="bg-white shadow-md"
                onClick={() => handleDuplicate("userId", userId)}
              >
                중복검사
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              className="shadow"
              value={password}
              placeholder="비밀번호를 입력해주세요"
              onChange={(e) => handlePassword(e)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmpassword">비밀번호 확인</Label>
            <Input
              id="confirmpassword"
              type="password"
              className="shadow"
              value={confirmpassword}
              placeholder="비밀번호를 한번 더 입력해주세요"
              onChange={(e) => setConfirmpassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <div className="flex gap-2">
              <Input
                id="nickname"
                type="text"
                className="shadow"
                value={nickname}
                placeholder="닉네임을 입력해주세요."
                onChange={(e) => handleNickname(e)}
                ref={(el) => (duplicateRef.current.nickname = el)}
                required
              />
              <Button
                variant="outline"
                className="bg-white shadow-md"
                onClick={() => handleDuplicate("nickname", nickname)}
              >
                중복검사
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="text"
                className="shadow"
                value={email}
                placeholder="이메일을 입력해주세요."
                onChange={(e) => handleEmail(e)}
                ref={(el) => (duplicateRef.current.email = el)}
                required
              />
              <Button
                className="bg-white shadow-md"
                variant="outline"
                onClick={() => handleDuplicate("email", email)}
              >
                중복검사
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="choose-expert">전문가</Label>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                className={`w-1/2 ${
                  trainer_yn === "expert" ? "bg-black text-white" : "bg-white"
                }`}
                onClick={() => handleTrainer_yn("expert")}
              >
                전문가
              </Button>
              <Button
                variant="outline"
                className={`w-1/2 ${
                  trainer_yn === "people" ? "bg-black text-white" : "bg-white"
                }`}
                onClick={() => handleTrainer_yn("people")}
              >
                일반인
              </Button>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-black text-white shadow"
          onClick={handleSubmit}
        >
          다음
        </Button>
      </div>
    </>
  );
}