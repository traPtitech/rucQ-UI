import type { components } from '@/api/schema'

export type User = components['schemas']['UserResponse']
export type Camp = components['schemas']['CampResponse']

export type CampEvent = components['schemas']['EventResponse']
export type MomentEvent = components['schemas']['MomentEventResponse']
export type DurationEvent = components['schemas']['DurationEventResponse']
export type OfficialEvent = components['schemas']['OfficialEventResponse']
export type DurationEventRequest = components['schemas']['DurationEventRequest']

export type QuestionGroup = components['schemas']['QuestionGroupResponse']
export type Question = components['schemas']['QuestionResponse']
export type Answer = components['schemas']['AnswerResponse']
export type QuestionCreatedActivity = components['schemas']['QuestionCreatedActivity']

export type Dashboard = components['schemas']['DashboardResponse']
export type Payment = components['schemas']['PaymentResponse']

export type RoomGroup = components['schemas']['RoomGroupResponse']
export type Room = components['schemas']['RoomResponse']
export type RoomStatus = components['schemas']['RoomStatus']
export type RoomStatusLog = components['schemas']['RoomStatusLog']

export type Activity = components['schemas']['ActivityResponse']

export type RollCall = components['schemas']['RollCallResponse']
export type RollCallReaction = components['schemas']['RollCallReactionResponse']
export type RollCallReactionEvent = components['schemas']['RollCallReactionEvent']
export type RollCallCreatedActivity = components['schemas']['RollCallCreatedActivity']
