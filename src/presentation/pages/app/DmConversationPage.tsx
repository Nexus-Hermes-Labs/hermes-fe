// /channels/@me/:conversationId — DM or group DM chat view

import { useState, useEffect } from 'react'
import { MessageSquare, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useGetConversation } from '@/application/conversation/useGetConversation'
import { useGetConversationMessages } from '@/application/message/useGetConversationMessages'
import { useSendConversationMessage } from '@/application/message/useSendConversationMessage'
import { useEditMessage } from '@/application/message/useEditMessage'
import { useDeleteMessage } from '@/application/message/useDeleteMessage'
import { useUIStore } from '@/state/uiStore'
import { useAuthStore } from '@/state/authStore'
import { useWsStore } from '@/state/wsStore'
import { MessageList } from '@/presentation/components/message/MessageList'
import { MessageInput } from '@/presentation/components/message/MessageInput'
import { ConversationTranslationControl } from '@/presentation/components/translation/ConversationTranslationControl'
import type { Message } from '@/domain/message/entities'
import type { SendMessageData } from '@/presentation/dto/message.dto'

interface DmConversationPageProps {
  conversationId: string
}

export default function DmConversationPage({ conversationId }: DmConversationPageProps) {
  const { setActiveGuild, setActiveChannel } = useUIStore()
  const { user } = useAuthStore()
  const { subscribe, unsubscribe } = useWsStore()
  const [replyTo, setReplyTo] = useState<Message | null>(null)

  useEffect(() => {
    setActiveGuild(null)
    setActiveChannel(null)
    setReplyTo(null)
    subscribe(conversationId)
    return () => { unsubscribe(conversationId) }
  }, [conversationId, setActiveGuild, setActiveChannel, subscribe, unsubscribe])

  const { data: conversation } = useGetConversation(conversationId)
  const { data, isLoading } = useGetConversationMessages(conversationId)
  const sendMessage = useSendConversationMessage(conversationId)
  const editMessage = useEditMessage()
  const deleteMessage = useDeleteMessage()

  // Derive a display name for the conversation
  const headerName = (() => {
    if (!conversation) return 'Loading...'
    if (conversation.conversationType === 'group_dm') {
      return conversation.name ?? 'Group DM'
    }
    // DM: show the other member's ID (no profile cache yet)
    const other = conversation.members.find((m) => m.userId !== user?.userId)
    return other ? `User ${other.userId.slice(0, 8)}` : 'Direct Message'
  })()

  const isDm = conversation?.conversationType === 'dm'

  const displayMessages = [...(data?.messages ?? [])].reverse()

  const handleSend = (formData: SendMessageData) => {
    sendMessage.mutate(formData, {
      onError: () => toast.error('Failed to send message'),
    })
    setReplyTo(null)
  }

  const handleEdit = (messageId: string, content: string) => {
    editMessage.mutate(
      { messageId, content, conversationId },
      { onError: () => toast.error('Failed to edit message') },
    )
  }

  const handleDelete = (messageId: string) => {
    deleteMessage.mutate(
      { messageId, conversationId },
      { onError: () => toast.error('Failed to delete message') },
    )
  }

  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--color-content-area)' }}>
      {/* Header */}
      <div
        className="flex h-12 flex-shrink-0 items-center gap-2 px-4 shadow-sm"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        {isDm ? (
          <MessageSquare size={20} style={{ color: 'var(--color-text-muted)' }} />
        ) : (
          <Users size={20} style={{ color: 'var(--color-text-muted)' }} />
        )}
        <h1 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {headerName}
        </h1>
        {!isDm && conversation && (
          <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
            {conversation.members.length} members
          </span>
        )}
        <div className="ml-auto">
          <ConversationTranslationControl conversationKey={conversationId} />
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={displayMessages}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReply={setReplyTo}
        welcomeTitle={isDm ? `${headerName}` : `Welcome to ${headerName}`}
        welcomeSubtitle={
          isDm
            ? 'This is the beginning of your direct message history.'
            : 'This is the start of this group conversation.'
        }
        welcomeIcon="dm"
      />

      {/* Input */}
      <MessageInput
        placeholder={`Message ${headerName}`}
        onSend={handleSend}
        isSending={sendMessage.isPending}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        conversationKey={conversationId}
      />
    </div>
  )
}
