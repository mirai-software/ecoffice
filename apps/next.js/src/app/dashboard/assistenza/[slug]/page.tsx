"use client";
import LoadingComponent from "@/app/_components/loading";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  const { data, isLoading } = api.admin.getSupportRequestfromId.useQuery({
    id: params.slug,
  });

  const router = useRouter();

  const [newMessage, setNewMessage] = useState("");
  const AddMessageToCitySupportRequest =
    api.admin.AddMessageToCitySupportRequest.useMutation();
  const utils = api.useUtils();

  const HandleSend = async () => {
    if (data && newMessage !== "") {
      await AddMessageToCitySupportRequest.mutateAsync({
        requestId: data.id,
        message: newMessage,
      });
    }
    utils.admin.getCitySupportRequests.invalidate();
    setNewMessage("");
  };

  if (isLoading) {
    return <LoadingComponent />;
  } else if (!data) {
    return <div>Errore</div>;
  } else {
    return (
      <div className="h-full w-full rounded-xl bg-white/80 p-4">
        {/* Dettagli della richiesta selezionata */}
        {data ? (
          <section className="flex h-full flex-col">
            <div className="flex items-center  gap-2">
              <ArrowLeft size={24} onClick={() => router.back()} />
              <h2 className="text-xl font-bold">
                {data.user.firstName + " " + data.user.lastName}
              </h2>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {data.messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 w-[90%] rounded-xl p-4 ${message.user.role === "user" ? "bg-gray-100" : " ml-auto bg-blue-100"}`}
                >
                  <span className="flex w-full justify-between text-xs">
                    <p>
                      {message.user.firstName + " " + message.user.lastName}
                    </p>
                    {new Date(message.createdAt).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })}
                    ,{" "}
                    {new Date(message.createdAt).toLocaleTimeString("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
    );
  }
}
