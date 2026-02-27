// /channels/:guildId/:channelId — guild text channel view

import { useState, useEffect } from 'react'
import { Hash } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useListChannels } from '@/application/channel/useListChannels'
import { useGetChannelMessages } from '@/application/message/useGetChannelMessages'
import { useSendChannelMessage } from '@/application/message/useSendChannelMessage'
import { useEditMessage } from '@/application/message/useEditMessage'
import { useDeleteMessage } from '@/application/message/useDeleteMessage'
import { useUIStore } from '@/state/uiStore'
import { useWsStore } from '@/state/wsStore'
import { MessageList } from '@/presentation/components/message/MessageList'
import { MessageInput } from '@/presentation/components/message/MessageInput'
import type { Message } from '@/domain/message/entities'
import type { SendMessageData } from '@/presentation/dto/message.dto'

export default function ChannelPage() {
  const params = useParams({ strict: false }) as { guildId: string; channelId: string }
  const { data: channels } = useListChannels(params.guildId)
  const { setActiveGuild, setActiveChannel } = useUIStore()
  const { subscribe, unsubscribe } = useWsStore()
  const [replyTo, setReplyTo] = useState<Message | null>(null)

  useEffect(() => {
    setActiveGuild(params.guildId)
    setActiveChannel(params.channelId)
    setReplyTo(null)
    // Subscribe to real-time events for this channel
    subscribe(params.channelId)
    return () => { unsubscribe(params.channelId) }
  }, [params.guildId, params.channelId, setActiveGuild, setActiveChannel, subscribe, unsubscribe])

  const channel = channels?.find((c) => c.channelId === params.channelId)

  const { data, isLoading } = useGetChannelMessages(params.channelId)
  const sendMessage = useSendChannelMessage(params.channelId)
  const editMessage = useEditMessage()
  const deleteMessage = useDeleteMessage()

  // API returns newest-first; display oldest-first
  const displayMessages = [...(data?.messages ?? [])].reverse()

  const handleSend = (formData: SendMessageData) => {
    sendMessage.mutate(formData, {
      onError: () => toast.error('Failed to send message'),
    })
    setReplyTo(null)
  }

  const handleEdit = (messageId: string, content: string) => {
    editMessage.mutate(
      { messageId, content, channelId: params.channelId },
      { onError: () => toast.error('Failed to edit message') },
    )
  }

  const handleDelete = (messageId: string) => {
    deleteMessage.mutate(
      { messageId, channelId: params.channelId },
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
        <Hash size={20} style={{ color: 'var(--color-text-muted)' }} />
        <h1 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {channel?.name ?? 'Loading...'}
        </h1>
        {channel?.description && (
          <>
            <div className="mx-2 h-4 w-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>
              {channel.description}
            </span>
          </>
        )}
      </div>

      {/* Messages */}
      <MessageList
        messages={displayMessages}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReply={setReplyTo}
        welcomeTitle={`Welcome to #${channel?.name ?? '...'}!`}
        welcomeSubtitle={`This is the start of the #${channel?.name ?? '...'} channel.`}
        welcomeIcon="hash"
      />

      {/* Input */}
      <MessageInput
        placeholder={`Message #${channel?.name ?? '...'}`}
        onSend={handleSend}
        isSending={sendMessage.isPending}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  )
}
