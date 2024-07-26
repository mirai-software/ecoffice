"use client";
import Container from "../../_components/container";
import { useMediaQuery } from "@uidotdev/usehooks";
import { api } from "@/trpc/react";
import LoadingComponent from "@/app/_components/loading";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

import { Send } from "lucide-react";
export default function home() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const { data, isLoading } = api.admin.getCitySupportRequests.useQuery();
  const [selectedRequest, setSelectedRequest] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const AddMessageToCitySupportRequest =
    api.admin.AddMessageToCitySupportRequest.useMutation();
  const utils = api.useUtils();

  const HandleSend = async () => {
    if (data && data[selectedRequest] && newMessage !== "") {
      await AddMessageToCitySupportRequest.mutateAsync({
        requestId: data[selectedRequest]?.id as string,
        message: newMessage,
      });
    }
    utils.admin.getCitySupportRequests.invalidate();
    setNewMessage("");
  };

  const filteredData =
    data?.filter((request) => {
      const fullName =
        `${request.user.firstName} ${request.user.lastName}`.toLowerCase();
      const lastMessage =
        request.messages[request.messages.length - 1]?.content.toLowerCase() ||
        "";
      const matchesFilter =
        fullName.includes(filter.toLowerCase()) ||
        lastMessage.includes(filter.toLowerCase());
      const matchesStatus = !filterActive || request.status === "open";
      return matchesFilter && matchesStatus;
    }) || [];

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingComponent />
      </Container>
    );
  } else if (isDesktop) {
    return (
      <Container>
        <div className="flex h-full gap-2">
          <section className="h-full w-1/3 rounded-xl border-b bg-white/80 p-4">
            <div className="mb-4 flex items-center gap-2">
              <RefreshCcw
                size={24}
                className="transform cursor-pointer transition-transform hover:rotate-180"
                onClick={() => utils.admin.getCitySupportRequests.invalidate()}
              />
              <input
                type="text"
                placeholder="Cerca utente"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className=" w-full rounded-xl border bg-gray-300/10 p-2"
              />
            </div>
            <div className="mb-4 flex items-center justify-center gap-2 border-b-2 pb-4">
              <Checkbox
                id="terms"
                onClick={() => setFilterActive(!filterActive)}
                checked={filterActive}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mostra solo richiesta attive
              </label>
            </div>
            <div className="h-96 overflow-y-auto">
              {/* Lista delle richieste */}
              {filteredData?.length > 0 ? (
                filteredData.map((request, index) => (
                  <div
                    key={index}
                    className="cursor-pointer border-b p-2 hover:bg-slate-500/10"
                    onClick={() => setSelectedRequest(index)}
                  >
                    <div className="flex items-center justify-center justify-between">
                      <h2 className="font-bold">
                        {highlightText(
                          request.user.firstName + " " + request.user.lastName,
                          filter,
                        )}
                      </h2>
                      <span className="text-xs">
                        {new Date(request.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {highlightText(
                        request.messages[request.messages.length - 1]
                          ?.content as string,
                        filter,
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">Nessuna richiesta</p>
                </div>
              )}
            </div>
          </section>
          <div className="h-full w-2/3 rounded-xl bg-white/80 p-4">
            {/* Dettagli della richiesta selezionata */}
            {data && data[selectedRequest] ? (
              <section className="flex h-full flex-col">
                <h2 className="text-xl font-bold">
                  {data[selectedRequest]!.user.firstName +
                    " " +
                    data[selectedRequest]!.user.lastName}
                </h2>
                <div className="mt-4 flex flex-col gap-2">
                  {data[selectedRequest]!.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 w-[90%] rounded-xl p-4 ${message.user.role === "user" ? "bg-gray-100" : " ml-auto bg-blue-100"}`}
                    >
                      <span className="flex w-full justify-between text-xs">
                        <p>
                          {message.user.firstName + " " + message.user.lastName}
                        </p>
                        {new Date(message.createdAt).toLocaleDateString(
                          "it-IT",
                          { day: "numeric", month: "short" },
                        )}
                        ,{" "}
                        {new Date(message.createdAt).toLocaleTimeString(
                          "it-IT",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                      <p className="mt-2 text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex flex-row items-center justify-center gap-2">
                  <input
                    type="text"
                    placeholder="Inizia a digitare"
                    className=" w-full rounded-xl border p-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    onClick={HandleSend}
                    disabled={newMessage === ""}
                    className="flex w-fit items-center justify-center rounded-full bg-foreground p-2 text-white disabled:bg-gray-500"
                  >
                    <Send size={24} />
                  </button>
                </div>
              </section>
            ) : (
              <p className="text-sm text-gray-500">
                Seleziona una richiesta per vedere i dettagli
              </p>
            )}
          </div>
        </div>
      </Container>
    );
  } else
    return (
      <section className="h-full w-full bg-white/80 p-4">
        <input
          type="text"
          placeholder="Cerca utente"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 w-full rounded-xl border bg-gray-300/10 p-2"
        />
        <div className="mb-4 flex items-center justify-center gap-2 border-b-2 pb-4">
          <Checkbox
            id="terms"
            onClick={() => setFilterActive(!filterActive)}
            checked={filterActive}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostra solo richiesta attive
          </label>
        </div>
        <div className="h-96 overflow-y-auto">
          {/* Lista delle richieste */}
          {filteredData?.length > 0 ? (
            filteredData.map((request, index) => (
              <div
                key={index}
                className="cursor-pointer border-b p-2 hover:bg-slate-500/10"
                onClick={() =>
                  router.push(`/dashboard/assistenza/${request.id}`)
                }
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">
                    {highlightText(
                      request.user.firstName + " " + request.user.lastName,
                      filter,
                    )}
                  </h2>
                  <span className="text-xs">
                    {new Date(request.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {highlightText(
                    request.messages[request.messages.length - 1]
                      ?.content as string,
                    filter,
                  )}
                </p>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-500">Nessuna richiesta</p>
            </div>
          )}
        </div>
      </section>
    );
}
