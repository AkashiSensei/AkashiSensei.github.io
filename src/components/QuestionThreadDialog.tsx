import "./questions.css"
import { useLayoutEffect, useRef, type RefObject, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { Dialog as DialogPrimitive } from "radix-ui"
import { Dialog, DialogPortal, DialogOverlay, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { QuestionText } from "@/components/QuestionText"
import { QuestionTags } from "@/components/QuestionTags"
import { ProjectSummary } from "@/components/ProjectSummary"
import { QuestionConversationFlow } from "@/components/QuestionConversationFlow"
import { QuestionImageBubble } from "@/components/QuestionImageBubble"
import { questionRoundImages } from "@/lib/question-images"
import { retainConversationExit } from "@/lib/question-conversation-animation"
import { questionThreads, type QuestionThread } from "@/data/questions"
import { useQuestionCopy } from "@/hooks/use-question-copy"
import { QuestionDialogContext } from "@/hooks/use-question-dialog"

function QuestionConversationPresence({ children, contentRef, backdropRef, exitRef }: {
  children: ReactNode
  contentRef: RefObject<HTMLDivElement | null>
  backdropRef: RefObject<HTMLDivElement | null>
  exitRef: RefObject<(() => void) | null>
}) {
  useLayoutEffect(() => {
    // Reopening removes an older exit layer before the new dialog is painted.
    exitRef.current?.()
    exitRef.current = null
    return () => {
      // Layout cleanup runs before the modal DOM and its scroll lock detach.
      // The portal mounts after this effect; capture its live refs on unmount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (contentRef.current) exitRef.current = retainConversationExit(contentRef.current, backdropRef.current)
    }
  }, [contentRef, backdropRef, exitRef])
  return children
}

function ThreadBody({ thread, roundId, open }: { thread: QuestionThread; roundId: string | null; open: boolean }) {
  const { t, i18n } = useTranslation("questions")
  const copy = useQuestionCopy()(thread)

  return (
    <QuestionConversationFlow open={open} roundId={roundId}>
        <DialogDescription className="sr-only">
          {t("rounds", { count: thread.rounds.length })}
          {!i18n.language.startsWith("zh") && copy.lang.startsWith("zh") ? ` · ${t("sourceLanguage")}` : ""}
        </DialogDescription>
        <div className="question-rounds" lang={copy.lang}>
          {thread.rounds.map((id, index) => <section className="question-round" id={`question-round-${id}`} key={id}>
            <div className="question-message question-message-question">
              {index === 0 && <QuestionTags ids={thread.tagIds} />}
              <h3 className="question-bubble question-bubble-question"><QuestionText text={copy.rounds[id].question} /></h3>
            </div>
            {questionRoundImages(thread, id).map((image) => <QuestionImageBubble key={image.src} image={image} />)}
            <div className="question-message question-message-answer">
              <div className="question-bubble question-answer" data-unanswered={!copy.rounds[id].answer || undefined}>
                <QuestionText text={copy.rounds[id].answer || t("unanswered")} />
              </div>
            </div>
            {questionRoundImages(thread, id, "answer").map((image) => <QuestionImageBubble key={image.src} image={image} side="answer" />)}
          </section>)}
        </div>
        <ProjectSummary projects={thread.relatedProjects} className="question-project-summary" />
    </QuestionConversationFlow>
  )
}

export function QuestionDialogProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation("questions")
  const getCopy = useQuestionCopy()
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const exitRef = useRef<(() => void) | null>(null)
  const triggerPath = useRef("")
  const blankPointerDown = useRef(false)
  const params = new URLSearchParams(location.search)
  const selectedId = params.get("question")
  const roundId = params.get("round")
  const thread = questionThreads.find((item) => item.id === selectedId)
  const open = selectedId !== null
  const close = () => {
    if (location.state?.questionDialogFrom) {
      navigate(-1)
    } else {
      params.delete("question")
      params.delete("round")
      navigate({ search: params.toString() }, { replace: true, state: location.state })
    }
  }

  return <QuestionDialogContext.Provider value={{ selectedId, openQuestion: (id, trigger) => {
    triggerRef.current = trigger
    triggerPath.current = location.pathname
    const next = new URLSearchParams(location.search)
    next.set("question", id)
    next.delete("round")
    navigate({ search: next.toString() }, {
      state: { ...location.state, questionDialogFrom: location.pathname + location.search },
    })
  } }}>
    {children}
    {open && <QuestionConversationPresence contentRef={contentRef} backdropRef={backdropRef} exitRef={exitRef}>
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) close() }}>
      <DialogPortal>
        <DialogOverlay className="question-conversation-backdrop" ref={backdropRef} />
        <DialogPrimitive.Content className="question-conversation" ref={contentRef}
        onOpenAutoFocus={(event) => {
          // Start reading at the first question, not at the project's first link below it.
          event.preventDefault()
          contentRef.current?.focus({ preventScroll: true })
        }}
        onPointerDown={(event) => { blankPointerDown.current = event.target === event.currentTarget }}
        onPointerCancel={() => { blankPointerDown.current = false }}
        onClick={(event) => {
          // A selection dragged out of a bubble must not dismiss the conversation.
          if (open && blankPointerDown.current && event.target === event.currentTarget) close()
          blankPointerDown.current = false
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          if (contentRef.current) return
          if (window.location.pathname === triggerPath.current && triggerRef.current?.isConnected) {
            triggerRef.current.focus({ preventScroll: true })
          } else if (!triggerRef.current) {
            document.querySelector<HTMLElement>("[data-question-fallback]")?.focus({ preventScroll: true })
          }
        }}>
          <DialogTitle className="sr-only">
            {thread ? <span lang={getCopy(thread).lang}><QuestionText text={getCopy(thread).rounds[thread.rounds[0]].question} /></span> : t("notFound")}
          </DialogTitle>
        {thread ? <ThreadBody key={thread.id} thread={thread} roundId={roundId} open />
          : <QuestionConversationFlow open={open}><DialogDescription className="question-bubble" data-conversation-not-found>{t("notFoundDescription")}</DialogDescription></QuestionConversationFlow>}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
    </QuestionConversationPresence>}
  </QuestionDialogContext.Provider>
}
