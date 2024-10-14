import { useCallback, useEffect, useState } from "react";
import CommentWriteComponent from "./comment-write";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { api } from "@/modules/api.module";
import moment from "moment/moment";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ExpertBadgeComponent from "./ui/expert-badge";
import DeleteDialogComponent from "./delete-dialog";
import { showToast } from "./layout/toast";
import { useSelector } from "react-redux";

export default function CommentComponent({
  commentList: list,
  feedId,
  setFeed,
}) {
  const [commentList, setCommentList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editContents, setEditContents] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const { userId: currentUser } = useSelector(
    (state) => state.memberReducer.loginData
  );
  const isError = true;

  const refetchList = async () => {
    const response = await api.get(`/comment/${feedId}`);

    if (response.result === "success") {
      setCommentList(response.data.length > 0 ? response.data : []);
      setFeed((current) => ({
        ...current,
        commentNum: response.data.length,
      }));
    }
  };
  useEffect(() => {
    setCommentList(list);
  }, [list]);

  const handleDelete = async () => {
    const response = await api.delete(`/comment/delete/${deleteId}`, {
      data: {
        feedId,
      },
    });
    if (response.result === "success") {
      showToast("삭제 되었습니다.");
      refetchList();
    } else {
      showToast("삭제 되었습니다.", isError);
    }
    return false;
  };

  const handleEdit = async (id) => {
    const response = await api.patch(`/comment/edit/${id}`, {
      id,
      contents: editContents,
    });
    if (response.result === "success") {
      setEditId("");
      setEditContents("");
      refetchList();
    }
  };

  moment.locale("ko");

  return (
    <>
      <div className="space-y-4">
        {commentList.map((comment, key) => {
          return (
            <div key={key} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {comment.memberComment.nickname.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 justify-between">
                  <div className="font-medium flex items-center gap-2">
                    {comment.memberComment.nickname}
                    <ExpertBadgeComponent />

                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {moment(comment.createdAt).fromNow()}
                    </div>
                  </div>
                  {currentUser === comment.memberComment.userId ? (
                    <div>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
                            <DotsHorizontalIcon
                              aria-hidden="true"
                              className="-mr-1 h-5 w-5 text-gray-400"
                            />
                          </MenuButton>
                        </div>

                        <MenuItems
                          transition
                          className="absolute right-0 z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="py-1">
                            <MenuItem>
                              <a
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                onClick={() => {
                                  setEditId(comment.id);
                                  setEditContents(comment.contents);
                                }}
                              >
                                수정
                              </a>
                            </MenuItem>

                            <MenuItem>
                              <a
                                className="cursor block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                onClick={() => {
                                  setDeleteOpen(true);
                                  setDeleteId(comment.id);
                                }}
                              >
                                삭제
                              </a>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {editId === comment.id ? (
                  <div className="flex flex-row">
                    <Input
                      type="text"
                      value={editContents}
                      onChange={(e) => {
                        setEditContents(e.currentTarget.value);
                      }}
                      className="flex-grow-[8]"
                    />
                    <Button
                      type="button"
                      className="flex-grow-[2]"
                      onClick={() => handleEdit(comment.id)}
                    >
                      수정
                    </Button>
                  </div>
                ) : (
                  <p>{comment.contents}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {deleteOpen ? (
        <DeleteDialogComponent
          open={deleteOpen}
          setDeleteOpen={setDeleteOpen}
          title={"댓글"}
          handleDelete={handleDelete}
        />
      ) : (
        ""
      )}

      <div className="space-y-4">
        <CommentWriteComponent feedId={feedId} refetchList={refetchList} />
      </div>
    </>
  );
}
