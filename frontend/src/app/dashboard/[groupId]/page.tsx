'use client';

import ChatBox from '../../../components/ChatBox';

interface GroupChatPageProps {
  params: { groupId: string };
}

export default function GroupChatPage({ params }: GroupChatPageProps) {
  const groupId = parseInt(params.groupId, 10);

  return (
    <div className="h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Group Chat {groupId}</h2>
      <div className="flex-1">
        <ChatBox groupId={groupId} />
      </div>
    </div>
  );
}
