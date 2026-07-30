## ADDED Requirements

### Requirement: Bot entry and main menu
The Telegram bot SHALL greet the client on `/start` and show a persistent reply keyboard with at least: book a consultation, ask a question, pay for a session.

#### Scenario: Start menu
- **WHEN** the client sends `/start`
- **THEN** the bot replies with brand/context copy and the three primary actions on the keyboard

### Requirement: Book consultation flow
The bot SHALL collect name, contact (phone or email), and optional comment, then forward a structured booking lead to the psychologist’s Telegram chat (`TELEGRAM_CHAT_ID`).

#### Scenario: Booking completed
- **WHEN** the client completes the booking dialogue
- **THEN** the psychologist receives a notification with name, contact, comment, and client Telegram identity
- **AND** the client receives a confirmation that the request was accepted

### Requirement: Ask a question flow
The bot SHALL accept a free-text question from the client and forward it to the psychologist’s Telegram chat.

#### Scenario: Question forwarded
- **WHEN** the client chooses «Задать вопрос» and sends a question
- **THEN** the psychologist receives the question text and client Telegram identity
- **AND** the client is told that the psychologist will reply

### Requirement: Pay for session flow
The bot SHALL present payment instructions from configuration (`TELEGRAM_PAYMENT_URL` and/or `TELEGRAM_PAYMENT_DETAILS`) and collect a short client note (what is being paid / amount comment), then forward a payment intent to the psychologist.

#### Scenario: Payment intent forwarded
- **WHEN** the client chooses «Оплатить сеанс» and sends a payment note
- **THEN** the psychologist receives a payment notification with the note and client Telegram identity
- **AND** the client sees payment instructions and confirmation that the notice was sent

### Requirement: Forward client messages to psychologist
Client messages that complete a bot flow or that are free-text outside an active dialogue SHALL be forwarded to `TELEGRAM_CHAT_ID`. Messages from the psychologist’s own admin chat SHALL NOT be treated as client leads.

#### Scenario: Free-text message
- **WHEN** a client sends an unmatched free-text message while not in an active flow
- **THEN** the bot forwards the text to the psychologist and acknowledges receipt to the client

### Requirement: Configuration without frontend secrets
Bot credentials (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, optional `TELEGRAM_ADMIN_USERNAME`, payment fields) SHALL live in server-side `bot/.env` (or host secrets), not in the public landing `js/config.js`.

#### Scenario: Landing config
- **WHEN** the public site config is inspected
- **THEN** it exposes only the public bot username for deep links, not the bot token
