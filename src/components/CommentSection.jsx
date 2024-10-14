import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux"; // Redux에서 사용자 정보 가져오기
import moment from "moment"; // moment.js import
import "moment/locale/ko"; // 한국어 로케일

export default function CommentSection({
  isOpen,
  onClose,
  comments: initialComments = [],
  onSaveComment, // 댓글 저장 함수 추가
}) {
  // 댓글 상태 관리
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  // Redux에서 로그인한 사용자 정보 가져오기
  const { userId, nickname, avatar } = useSelector(
    (state) => state.memberReducer.loginData
  );

  useEffect(() => {
    console.log(comments);
  }, [comments]);
  if (!isOpen) return null; // 모달이 열릴 때만 렌더링
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end mb-16 justify-center p-4">
      <div className="bg-white dark:bg-gray-950 rounded-t-2xl w-full max-w-md shadow-lg">
        {/* 상단 닫기 버튼 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="font-medium">댓글</div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            &times;
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>
                    {comment.memberComment?.nickname.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-medium flex flex-row items-center gap-4">
                    <span>@{comment.memberComment.userId}</span>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {moment(comment.createdAt).fromNow()} 
                      {/* 작성한 시간을 상대적으로 표시 */}
                    </div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {comment.contents}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // 댓글이 없을 때 중앙에 메시지 표시
            <div className="flex flex-col justify-center items-center text-center h-40">
              <div className="text-lg font-semibold">아직 댓글이 없습니다</div>
              <div className="text-gray-500">댓글을 남겨보세요.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
