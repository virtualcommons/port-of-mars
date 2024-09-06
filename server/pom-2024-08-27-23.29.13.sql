--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Debian 12.20-1.pgdg120+1)
-- Dumped by pg_dump version 15.8 (Debian 15.8-0+deb12u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: marsmadness
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO marsmadness;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: moderation_action_action_enum; Type: TYPE; Schema: public; Owner: marsmadness
--

CREATE TYPE public.moderation_action_action_enum AS ENUM (
    'mute',
    'ban',
    'none'
);


ALTER TYPE public.moderation_action_action_enum OWNER TO marsmadness;

--
-- Name: player_role_enum; Type: TYPE; Schema: public; Owner: marsmadness
--

CREATE TYPE public.player_role_enum AS ENUM (
    'Curator',
    'Entrepreneur',
    'Pioneer',
    'Politician',
    'Researcher'
);


ALTER TYPE public.player_role_enum OWNER TO marsmadness;

--
-- Name: solo_game_status_enum; Type: TYPE; Schema: public; Owner: marsmadness
--

CREATE TYPE public.solo_game_status_enum AS ENUM (
    'incomplete',
    'victory',
    'defeat'
);


ALTER TYPE public.solo_game_status_enum OWNER TO marsmadness;

--
-- Name: solo_game_treatment_thresholdinformation_enum; Type: TYPE; Schema: public; Owner: marsmadness
--

CREATE TYPE public.solo_game_treatment_thresholdinformation_enum AS ENUM (
    'unknown',
    'range',
    'known'
);


ALTER TYPE public.solo_game_treatment_thresholdinformation_enum OWNER TO marsmadness;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_report; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.chat_report (
    id integer NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "gameId" integer NOT NULL,
    "userId" integer NOT NULL,
    message jsonb NOT NULL,
    resolved boolean DEFAULT false NOT NULL
);


ALTER TABLE public.chat_report OWNER TO marsmadness;

--
-- Name: chat_report_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.chat_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_report_id_seq OWNER TO marsmadness;

--
-- Name: chat_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.chat_report_id_seq OWNED BY public.chat_report.id;


--
-- Name: classroom; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.classroom (
    id integer NOT NULL,
    "teacherId" integer NOT NULL,
    "authToken" character varying NOT NULL,
    descriptor character varying NOT NULL
);


ALTER TABLE public.classroom OWNER TO marsmadness;

--
-- Name: classroom_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.classroom_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classroom_id_seq OWNER TO marsmadness;

--
-- Name: classroom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.classroom_id_seq OWNED BY public.classroom.id;


--
-- Name: game; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.game (
    id integer NOT NULL,
    "roomId" character varying NOT NULL,
    "buildId" character varying NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "dateFinalized" timestamp without time zone,
    "tournamentRoundId" integer NOT NULL,
    status character varying DEFAULT 'incomplete'::character varying NOT NULL,
    "winnerId" integer,
    type character varying DEFAULT 'freeplay'::character varying NOT NULL,
    "treatmentId" integer,
    "classroomId" integer
);


ALTER TABLE public.game OWNER TO marsmadness;

--
-- Name: game_event; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.game_event (
    id integer NOT NULL,
    "gameId" integer NOT NULL,
    type character varying NOT NULL,
    payload jsonb NOT NULL,
    "dateCreated" timestamp without time zone NOT NULL,
    "timeRemaining" integer NOT NULL
);


ALTER TABLE public.game_event OWNER TO marsmadness;

--
-- Name: game_event_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.game_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_event_id_seq OWNER TO marsmadness;

--
-- Name: game_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.game_event_id_seq OWNED BY public.game_event.id;


--
-- Name: game_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_id_seq OWNER TO marsmadness;

--
-- Name: game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.game_id_seq OWNED BY public.game.id;


--
-- Name: lobby_chat_message; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.lobby_chat_message (
    id integer NOT NULL,
    "dateCreated" timestamp without time zone NOT NULL,
    "userId" integer NOT NULL,
    message character varying NOT NULL,
    "roomId" character varying NOT NULL,
    "lobbyType" character varying NOT NULL
);


ALTER TABLE public.lobby_chat_message OWNER TO marsmadness;

--
-- Name: lobby_chat_message_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.lobby_chat_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lobby_chat_message_id_seq OWNER TO marsmadness;

--
-- Name: lobby_chat_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.lobby_chat_message_id_seq OWNED BY public.lobby_chat_message.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO marsmadness;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO marsmadness;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: moderation_action; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.moderation_action (
    id integer NOT NULL,
    "reportId" integer NOT NULL,
    "userId" integer NOT NULL,
    "adminId" integer NOT NULL,
    action public.moderation_action_action_enum NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "daysMuted" integer,
    "dateMuteExpires" timestamp without time zone GENERATED ALWAYS AS (
CASE
    WHEN ("daysMuted" IS NOT NULL) THEN ("dateCreated" + ('1 day'::interval * ("daysMuted")::double precision))
    ELSE NULL::timestamp without time zone
END) STORED,
    revoked boolean DEFAULT false NOT NULL
);


ALTER TABLE public.moderation_action OWNER TO marsmadness;

--
-- Name: moderation_action_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.moderation_action_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moderation_action_id_seq OWNER TO marsmadness;

--
-- Name: moderation_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.moderation_action_id_seq OWNED BY public.moderation_action.id;


--
-- Name: player; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.player (
    id integer NOT NULL,
    role public.player_role_enum NOT NULL,
    "userId" integer NOT NULL,
    "gameId" integer NOT NULL,
    points integer,
    "playerIp" character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.player OWNER TO marsmadness;

--
-- Name: player_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.player_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.player_id_seq OWNER TO marsmadness;

--
-- Name: player_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.player_id_seq OWNED BY public.player.id;


--
-- Name: question; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.question (
    id integer NOT NULL,
    "quizId" integer NOT NULL,
    question character varying NOT NULL,
    options jsonb NOT NULL,
    "correctAnswer" integer NOT NULL,
    "tutorialElementId" character varying NOT NULL,
    "order" integer NOT NULL
);


ALTER TABLE public.question OWNER TO marsmadness;

--
-- Name: question_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_id_seq OWNER TO marsmadness;

--
-- Name: question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.question_id_seq OWNED BY public.question.id;


--
-- Name: question_response; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.question_response (
    id integer NOT NULL,
    "questionId" integer NOT NULL,
    "submissionId" integer NOT NULL,
    answer integer NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.question_response OWNER TO marsmadness;

--
-- Name: question_response_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.question_response_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_response_id_seq OWNER TO marsmadness;

--
-- Name: question_response_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.question_response_id_seq OWNED BY public.question_response.id;


--
-- Name: quiz; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.quiz (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.quiz OWNER TO marsmadness;

--
-- Name: quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.quiz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quiz_id_seq OWNER TO marsmadness;

--
-- Name: quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.quiz_id_seq OWNED BY public.quiz.id;


--
-- Name: quiz_submission; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.quiz_submission (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "quizId" integer NOT NULL
);


ALTER TABLE public.quiz_submission OWNER TO marsmadness;

--
-- Name: quiz_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.quiz_submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quiz_submission_id_seq OWNER TO marsmadness;

--
-- Name: quiz_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.quiz_submission_id_seq OWNED BY public.quiz_submission.id;


--
-- Name: solo_game; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_game (
    id integer NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "playerId" integer NOT NULL,
    "treatmentId" integer NOT NULL,
    "deckId" integer NOT NULL,
    status public.solo_game_status_enum NOT NULL,
    "twoEventsThreshold" integer NOT NULL,
    "threeEventsThreshold" integer NOT NULL,
    "maxRound" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.solo_game OWNER TO marsmadness;

--
-- Name: solo_game_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_game_id_seq OWNER TO marsmadness;

--
-- Name: solo_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_game_id_seq OWNED BY public.solo_game.id;


--
-- Name: solo_game_round; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_game_round (
    id integer NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "gameId" integer NOT NULL,
    "roundNumber" integer NOT NULL,
    "decisionId" integer NOT NULL,
    "initialSystemHealth" integer NOT NULL,
    "initialPoints" integer NOT NULL
);


ALTER TABLE public.solo_game_round OWNER TO marsmadness;

--
-- Name: solo_game_round_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_game_round_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_game_round_id_seq OWNER TO marsmadness;

--
-- Name: solo_game_round_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_game_round_id_seq OWNED BY public.solo_game_round.id;


--
-- Name: solo_game_treatment; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_game_treatment (
    id integer NOT NULL,
    "isNumberOfRoundsKnown" boolean NOT NULL,
    "isEventDeckKnown" boolean NOT NULL,
    "thresholdInformation" public.solo_game_treatment_thresholdinformation_enum NOT NULL
);


ALTER TABLE public.solo_game_treatment OWNER TO marsmadness;

--
-- Name: solo_game_treatment_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_game_treatment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_game_treatment_id_seq OWNER TO marsmadness;

--
-- Name: solo_game_treatment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_game_treatment_id_seq OWNED BY public.solo_game_treatment.id;


--
-- Name: solo_high_score; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_high_score (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "pointsPerRound" double precision NOT NULL,
    points integer NOT NULL,
    "maxRound" integer NOT NULL,
    "gameId" integer,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "lastModified" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.solo_high_score OWNER TO marsmadness;

--
-- Name: solo_high_score_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_high_score_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_high_score_id_seq OWNER TO marsmadness;

--
-- Name: solo_high_score_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_high_score_id_seq OWNED BY public.solo_high_score.id;


--
-- Name: solo_mars_event_card; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_mars_event_card (
    id integer NOT NULL,
    "codeName" character varying NOT NULL,
    "displayName" character varying NOT NULL,
    "flavorText" character varying NOT NULL,
    effect character varying NOT NULL,
    "drawMin" integer NOT NULL,
    "drawMax" integer NOT NULL,
    "rollMin" integer NOT NULL,
    "rollMax" integer NOT NULL,
    "systemHealthMultiplier" integer NOT NULL,
    "pointsMultiplier" integer NOT NULL,
    "resourcesMultiplier" integer NOT NULL
);


ALTER TABLE public.solo_mars_event_card OWNER TO marsmadness;

--
-- Name: solo_mars_event_card_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_mars_event_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_mars_event_card_id_seq OWNER TO marsmadness;

--
-- Name: solo_mars_event_card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_mars_event_card_id_seq OWNED BY public.solo_mars_event_card.id;


--
-- Name: solo_mars_event_deck; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_mars_event_deck (
    id integer NOT NULL
);


ALTER TABLE public.solo_mars_event_deck OWNER TO marsmadness;

--
-- Name: solo_mars_event_deck_card; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_mars_event_deck_card (
    id integer NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "deckId" integer NOT NULL,
    "cardId" integer NOT NULL,
    "effectText" character varying NOT NULL,
    "systemHealthEffect" integer NOT NULL,
    "resourcesEffect" integer NOT NULL,
    "pointsEffect" integer NOT NULL,
    "roundId" integer
);


ALTER TABLE public.solo_mars_event_deck_card OWNER TO marsmadness;

--
-- Name: solo_mars_event_deck_card_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_mars_event_deck_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_mars_event_deck_card_id_seq OWNER TO marsmadness;

--
-- Name: solo_mars_event_deck_card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_mars_event_deck_card_id_seq OWNED BY public.solo_mars_event_deck_card.id;


--
-- Name: solo_mars_event_deck_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_mars_event_deck_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_mars_event_deck_id_seq OWNER TO marsmadness;

--
-- Name: solo_mars_event_deck_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_mars_event_deck_id_seq OWNED BY public.solo_mars_event_deck.id;


--
-- Name: solo_player; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_player (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "playerIp" character varying DEFAULT ''::character varying NOT NULL,
    "gameId" integer,
    points integer,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.solo_player OWNER TO marsmadness;

--
-- Name: solo_player_decision; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.solo_player_decision (
    id integer NOT NULL,
    "systemHealthInvestment" integer NOT NULL,
    "pointsInvestment" integer NOT NULL
);


ALTER TABLE public.solo_player_decision OWNER TO marsmadness;

--
-- Name: solo_player_decision_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_player_decision_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_player_decision_id_seq OWNER TO marsmadness;

--
-- Name: solo_player_decision_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_player_decision_id_seq OWNED BY public.solo_player_decision.id;


--
-- Name: solo_player_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.solo_player_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solo_player_id_seq OWNER TO marsmadness;

--
-- Name: solo_player_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.solo_player_id_seq OWNED BY public.solo_player.id;


--
-- Name: student; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.student (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "classroomId" integer NOT NULL,
    "rejoinCode" character varying NOT NULL
);


ALTER TABLE public.student OWNER TO marsmadness;

--
-- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_id_seq OWNER TO marsmadness;

--
-- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


--
-- Name: teacher; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.teacher (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.teacher OWNER TO marsmadness;

--
-- Name: teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.teacher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teacher_id_seq OWNER TO marsmadness;

--
-- Name: teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.teacher_id_seq OWNED BY public.teacher.id;


--
-- Name: tournament; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.tournament (
    id integer NOT NULL,
    name character varying NOT NULL,
    active boolean NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "minNumberOfGameRounds" integer DEFAULT 8 NOT NULL,
    "maxNumberOfGameRounds" integer DEFAULT 12 NOT NULL,
    description character varying
);


ALTER TABLE public.tournament OWNER TO marsmadness;

--
-- Name: tournament_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.tournament_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tournament_id_seq OWNER TO marsmadness;

--
-- Name: tournament_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.tournament_id_seq OWNED BY public.tournament.id;


--
-- Name: tournament_round; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.tournament_round (
    id integer NOT NULL,
    "roundNumber" integer NOT NULL,
    "numberOfGameRounds" integer DEFAULT 12 NOT NULL,
    "tournamentId" integer NOT NULL,
    "introSurveyUrl" character varying,
    "exitSurveyUrl" character varying,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    championship boolean DEFAULT false NOT NULL,
    announcement character varying
);


ALTER TABLE public.tournament_round OWNER TO marsmadness;

--
-- Name: tournament_round_date; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.tournament_round_date (
    id integer NOT NULL,
    "tournamentRoundId" integer NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.tournament_round_date OWNER TO marsmadness;

--
-- Name: tournament_round_date_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.tournament_round_date_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tournament_round_date_id_seq OWNER TO marsmadness;

--
-- Name: tournament_round_date_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.tournament_round_date_id_seq OWNED BY public.tournament_round_date.id;


--
-- Name: tournament_round_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.tournament_round_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tournament_round_id_seq OWNER TO marsmadness;

--
-- Name: tournament_round_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.tournament_round_id_seq OWNED BY public.tournament_round.id;


--
-- Name: tournament_round_invite; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.tournament_round_invite (
    id integer NOT NULL,
    "tournamentRoundId" integer NOT NULL,
    "userId" integer NOT NULL,
    "hasParticipated" boolean DEFAULT false NOT NULL,
    "hasCompletedIntroSurvey" boolean DEFAULT false NOT NULL,
    "hasCompletedExitSurvey" boolean DEFAULT false NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tournament_round_invite OWNER TO marsmadness;

--
-- Name: tournament_round_invite_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.tournament_round_invite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tournament_round_invite_id_seq OWNER TO marsmadness;

--
-- Name: tournament_round_invite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.tournament_round_invite_id_seq OWNED BY public.tournament_round_invite.id;


--
-- Name: tournament_round_signup; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.tournament_round_signup (
    "tournamentRoundInviteId" integer NOT NULL,
    "tournamentRoundDateId" integer NOT NULL
);


ALTER TABLE public.tournament_round_signup OWNER TO marsmadness;

--
-- Name: tournament_treatments_treatment; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.tournament_treatments_treatment (
    "tournamentId" integer NOT NULL,
    "treatmentId" integer NOT NULL
);


ALTER TABLE public.tournament_treatments_treatment OWNER TO marsmadness;

--
-- Name: treatment; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.treatment (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "marsEventOverrides" jsonb
);


ALTER TABLE public.treatment OWNER TO marsmadness;

--
-- Name: treatment_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.treatment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.treatment_id_seq OWNER TO marsmadness;

--
-- Name: treatment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.treatment_id_seq OWNED BY public.treatment.id;


--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO marsmadness;

--
-- Name: user; Type: TABLE; Schema: public; Owner: marsmadness
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying NOT NULL,
    username character varying NOT NULL,
    email character varying,
    "passedQuiz" boolean DEFAULT false NOT NULL,
    "registrationToken" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "participantId" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "dateConsented" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "dateCreated" timestamp without time zone DEFAULT now() NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "passportId" character varying DEFAULT ''::character varying NOT NULL,
    "isSystemBot" boolean DEFAULT false NOT NULL,
    "lastPlayerIp" character varying DEFAULT ''::character varying NOT NULL,
    "isBanned" boolean DEFAULT false NOT NULL,
    "isMuted" boolean DEFAULT false NOT NULL,
    "muteStrikes" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."user" OWNER TO marsmadness;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: marsmadness
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO marsmadness;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marsmadness
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: chat_report id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.chat_report ALTER COLUMN id SET DEFAULT nextval('public.chat_report_id_seq'::regclass);


--
-- Name: classroom id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.classroom ALTER COLUMN id SET DEFAULT nextval('public.classroom_id_seq'::regclass);


--
-- Name: game id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game ALTER COLUMN id SET DEFAULT nextval('public.game_id_seq'::regclass);


--
-- Name: game_event id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game_event ALTER COLUMN id SET DEFAULT nextval('public.game_event_id_seq'::regclass);


--
-- Name: lobby_chat_message id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.lobby_chat_message ALTER COLUMN id SET DEFAULT nextval('public.lobby_chat_message_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: moderation_action id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.moderation_action ALTER COLUMN id SET DEFAULT nextval('public.moderation_action_id_seq'::regclass);


--
-- Name: player id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.player ALTER COLUMN id SET DEFAULT nextval('public.player_id_seq'::regclass);


--
-- Name: question id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.question ALTER COLUMN id SET DEFAULT nextval('public.question_id_seq'::regclass);


--
-- Name: question_response id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.question_response ALTER COLUMN id SET DEFAULT nextval('public.question_response_id_seq'::regclass);


--
-- Name: quiz id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.quiz ALTER COLUMN id SET DEFAULT nextval('public.quiz_id_seq'::regclass);


--
-- Name: quiz_submission id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.quiz_submission ALTER COLUMN id SET DEFAULT nextval('public.quiz_submission_id_seq'::regclass);


--
-- Name: solo_game id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game ALTER COLUMN id SET DEFAULT nextval('public.solo_game_id_seq'::regclass);


--
-- Name: solo_game_round id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game_round ALTER COLUMN id SET DEFAULT nextval('public.solo_game_round_id_seq'::regclass);


--
-- Name: solo_game_treatment id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game_treatment ALTER COLUMN id SET DEFAULT nextval('public.solo_game_treatment_id_seq'::regclass);


--
-- Name: solo_high_score id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_high_score ALTER COLUMN id SET DEFAULT nextval('public.solo_high_score_id_seq'::regclass);


--
-- Name: solo_mars_event_card id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_card ALTER COLUMN id SET DEFAULT nextval('public.solo_mars_event_card_id_seq'::regclass);


--
-- Name: solo_mars_event_deck id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_deck ALTER COLUMN id SET DEFAULT nextval('public.solo_mars_event_deck_id_seq'::regclass);


--
-- Name: solo_mars_event_deck_card id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_deck_card ALTER COLUMN id SET DEFAULT nextval('public.solo_mars_event_deck_card_id_seq'::regclass);


--
-- Name: solo_player id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_player ALTER COLUMN id SET DEFAULT nextval('public.solo_player_id_seq'::regclass);


--
-- Name: solo_player_decision id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_player_decision ALTER COLUMN id SET DEFAULT nextval('public.solo_player_decision_id_seq'::regclass);


--
-- Name: student id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


--
-- Name: teacher id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.teacher ALTER COLUMN id SET DEFAULT nextval('public.teacher_id_seq'::regclass);


--
-- Name: tournament id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament ALTER COLUMN id SET DEFAULT nextval('public.tournament_id_seq'::regclass);


--
-- Name: tournament_round id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round ALTER COLUMN id SET DEFAULT nextval('public.tournament_round_id_seq'::regclass);


--
-- Name: tournament_round_date id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_date ALTER COLUMN id SET DEFAULT nextval('public.tournament_round_date_id_seq'::regclass);


--
-- Name: tournament_round_invite id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_invite ALTER COLUMN id SET DEFAULT nextval('public.tournament_round_invite_id_seq'::regclass);


--
-- Name: treatment id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.treatment ALTER COLUMN id SET DEFAULT nextval('public.treatment_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: chat_report; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.chat_report (id, "dateCreated", "gameId", "userId", message, resolved) FROM stdin;
\.


--
-- Data for Name: classroom; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.classroom (id, "teacherId", "authToken", descriptor) FROM stdin;
1	1	asdf	test classroom
60	2	69237	test class 1
76	2	22441	test class 2
83	2	86729	test class 5
85	2	72224	test class 4
\.


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.game (id, "roomId", "buildId", "dateCreated", "dateFinalized", "tournamentRoundId", status, "winnerId", type, "treatmentId", "classroomId") FROM stdin;
1	kqrzHADg_	v2023.11-119-g8658	2024-07-23 21:31:24.342244	2024-07-23 21:32:28.439	4	defeat	\N	classroom	\N	60
2	PMN5T4OH-	v2023.11-122-gae15c6	2024-07-25 01:50:19.846694	\N	4	incomplete	\N	classroom	\N	60
3	yy_Pa6hBg	v2023.11-122-gae15c6	2024-07-25 01:54:18.480286	2024-07-25 01:54:39.533	4	defeat	\N	classroom	\N	60
4	eWaM4yM3m	v2023.11-122-gae15c6	2024-07-25 01:55:06.667247	2024-07-25 01:55:21.732	4	defeat	\N	classroom	\N	60
5	FwA3XskrK	v2023.11-122-gae15c6	2024-07-26 23:00:02.725359	2024-07-26 23:05:33.789	4	defeat	\N	classroom	\N	60
6	SlJL5hp5d	v2023.11-124-g59091	2024-07-31 00:58:24.67688	2024-07-31 01:04:29.736	4	defeat	\N	classroom	\N	60
\.


--
-- Data for Name: game_event; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.game_event (id, "gameId", type, payload, "dateCreated", "timeRemaining") FROM stdin;
1	1	taken-state-snapshot	{"logs": [], "phase": 0, "round": 1, "players": {"Curator": {"role": "Curator", "costs": {"legacy": 3, "culture": 2, "finance": 3, "science": 1000, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "MartianCamel3681", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "culture", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Curator", "purchased": [], "remaining": [96, 85, 92, 90, 88, 81, 87, 94, 97, 82, 95], "purchasable": [93, 91, 89]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Pioneer": {"role": "Pioneer", "costs": {"legacy": 2, "culture": 3, "finance": 1000, "science": 3, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "SolarCamel3847", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "legacy", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Pioneer", "purchased": [], "remaining": [21, 36, 31, 35, 25, 29, 22, 30, 33, 27, 34], "purchasable": [32, 28, 37]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Politician": {"role": "Politician", "costs": {"legacy": 1000, "culture": 1000, "finance": 3, "science": 3, "government": 2, "systemHealth": 1}, "isBot": false, "ready": false, "isMuted": false, "username": "GalacticCanary4199", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "government", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Politician", "purchased": [], "remaining": [74, 71, 73, 65, 70, 77, 75, 67, 68, 61, 72], "purchasable": [69, 62, 76]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Researcher": {"role": "Researcher", "costs": {"legacy": 3, "culture": 1000, "finance": 1000, "science": 2, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "LunarBison2329", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "science", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Researcher", "purchased": [], "remaining": [2, 9, 12, 17, 7, 11, 10, 16, 15, 1, 13], "purchasable": [5, 8, 14]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Entrepreneur": {"role": "Entrepreneur", "costs": {"legacy": 1000, "culture": 3, "finance": 2, "science": 1000, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "AuroralCamel4881", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "finance", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Entrepreneur", "purchased": [], "remaining": [48, 53, 52, 41, 47, 42, 54, 49, 57, 45, 51], "purchasable": [55, 56, 50]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}}, "winners": [], "maxRound": 10, "messages": [], "tradeSet": {}, "userRoles": {"LunarBison2329": "Researcher", "SolarCamel3847": "Pioneer", "AuroralCamel4881": "Entrepreneur", "MartianCamel3681": "Curator", "GalacticCanary4199": "Politician"}, "marsEvents": [], "heroOrPariah": "", "systemHealth": 100, "marsEventDeck": {"deck": [{"id": "sandstorm", "name": "Sandstorm", "effect": "For the next 3 rounds, destroy an additional 10 System Health at the start of the round.", "duration": 3, "flavorText": "Buckle in - things are about to get rough. And coarse. And irritating.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "murphysLaw", "name": "Murphy's Law", "effect": "Reveal 2 more events. They're both in effect.", "duration": 1, "flavorText": "Residents at Port of Mars know better than to ask, \\"what ELSE could go wrong?\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "difficultConditions", "name": "Difficult Conditions", "effect": "System Health costs twice as many Time Blocks as usual this round.", "duration": 1, "flavorText": "When one component breaks, it puts a strain on the rest of the system. Small failures often snowball into critical ones.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "changingTides", "name": "Changing Tides", "effect": "Each player discards all of their available Accomplishments and draws 1 new Accomplishment. You will be able to discard this Accomplishment at the end of this round and draw up to three new Accomplishments at the start of the next round (if this is not the final round).", "duration": 1, "flavorText": "Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "cropFailure", "name": "Crop Failure", "effect": "Destroy 20 System Health.", "duration": 1, "flavorText": "\\"The good news is we're not eating any more potatoes this cycle! The bad news is we're not sure what we're eating.\\" - The Researcher", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "bondingThroughAdversity", "name": "Bonding Through Adversity", "effect": "Each player gains one unit of Influence of their choice.", "duration": 1, "flavorText": "Challenges brings communities together.", "clientViewHandler": "INFLUENCES_DRAW"}, {"id": "stymied", "name": "Stymied", "effect": "Players may not earn their specialty Influence this round.", "duration": 1, "flavorText": "\\"That's very nice that you have three PhD's. Now pick up this toothbrush and help with cleaning our solar panel cells.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lostTime", "name": "Lost Time", "effect": "Each player has 5 fewer Time Blocks to spend this round.", "duration": 1, "flavorText": "Time flies when you're trying to stay alive.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "marketsClosed", "name": "Markets Closed", "effect": "Players may not trade Influences this round.", "duration": 1, "flavorText": "\\"Trust is difficult to build and easy to break. Yet without it, this community would fall apart.\\" - The Curator", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionCurator", "name": "Out of Commission", "effect": "The Curator receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionEntrepreneur", "name": "Out of Commission", "effect": "The Entrepreneur receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionPioneer", "name": "Out of Commission", "effect": "The Pioneer receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "interdisciplinary", "name": "Interdisciplinary", "effect": "For this round, each player can spend 3 Time Blocks to earn an Influence in either of the 2 Influences they normally can't create.", "duration": 1, "flavorText": "\\"Everyone knows the saying, 'Jack of all trades, master of none.' Few remember the second part: 'still better than a master of one.'\\" - The Pioneer", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "hullBreach", "name": "Hull Breach", "effect": "Destroy 7 System Health.", "duration": 1, "flavorText": "\\"Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "effortsWasted", "name": "Efforts Wasted", "effect": "Each player must discard an Accomplishment that they have already purchased.", "duration": 1, "flavorText": "\\"All markets are volatile. The trick is learning how to ride the waves.\\" - The Entrepreneur", "clientViewHandler": "ACCOMPLISHMENT_SELECT_PURCHASED"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionResearcher", "name": "Out of Commission", "effect": "The Researcher receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionPolitician", "name": "Out of Commission", "effect": "The Politician receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "heroOrPariah", "name": "Hero or Pariah", "effect": "CHOOSE ONE: Players must vote for 1 player to lose all Influence OR Players must vote for 1 player to gain 4 of their specialty Influence", "duration": 1, "flavorText": "In a community as small as Port of Mars, some individuals always stand out - for better or worse.", "clientViewHandler": "VOTE_FOR_PLAYER_HERO_PARIAH"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "compulsivePhilanthropy", "name": "Compulsive Philanthropy", "effect": "Players must vote for one player to put all their Time Blocks into System Health this round.", "duration": 1, "flavorText": "There's nothing quite like being volun-told for the greater good.", "clientViewHandler": "VOTE_FOR_PLAYER_SINGLE"}, {"id": "solarFlare", "name": "Solar Flare", "effect": "Destroy 5 System Health. Skip discussion and trading phases this turn. Players cannot chat or trade Influences.", "duration": 1, "flavorText": "Solar flares pose a far greater threat on Mars, where a thin atmosphere and non-existent magnetic field leaves settlers more vulnerable. ", "timeDuration": 10, "clientViewHandler": "DISABLE_CHAT"}, {"id": "audit", "name": "Audit", "effect": "In this round, players will be able to view each other's accomplishments, inventories, resources and investment decisions.", "duration": 1, "flavorText": "\\"Of course we trust everyone to be truthful. But it doesn't hurt to check now and again.\\" - The Politician", "timeDuration": 10, "clientViewHandler": "AUDIT"}, {"id": "personalGain", "name": "Personal Gain", "effect": "Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 System Health.", "duration": 1, "flavorText": "It's easy to take risks when others are incurring the costs.", "clientViewHandler": "VOTE_YES_NO"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "breakdownOfTrust", "name": "Breakdown of Trust", "effect": "Each player can choose to save up to 2 units of Influence that they already own. The rest will be lost.", "duration": 1, "flavorText": "Setbacks are inevitable, but no less painful each time.", "clientViewHandler": "INFLUENCES_SELECT"}], "position": 0}, "timeRemaining": 60, "lastTimePolled": 1721770284340, "tradingEnabled": true, "roundIntroduction": {"completedTrades": [], "systemHealthMarsEvents": [], "accomplishmentPurchases": [], "systemHealthAtStartOfRound": 100, "systemHealthMaintenanceCost": -25, "systemHealthGroupContributions": {}}, "marsEventsProcessed": 0}	2024-07-23 21:31:24.369	60
2	1	set-player-readiness	{"role": "Curator", "value": true}	2024-07-23 21:31:25.353	59
3	1	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-23 21:31:25.353	59
4	1	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-23 21:31:25.353	59
5	1	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-23 21:31:25.353	59
6	1	subtracted-system-health-wear-and-tear	{}	2024-07-23 21:32:13.782	11
7	1	entered-investment-phase	{}	2024-07-23 21:32:13.782	11
8	1	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-23 21:32:14.384	179
9	1	set-player-readiness	{"role": "Curator", "value": true}	2024-07-23 21:32:14.384	179
10	1	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-23 21:32:14.384	179
11	1	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-23 21:32:14.384	179
12	1	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-23 21:32:14.384	179
13	1	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-23 21:32:14.384	179
14	1	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-23 21:32:14.384	179
15	1	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-23 21:32:14.384	179
16	1	exited-investment-phase	{}	2024-07-23 21:32:18.024	176
17	1	entered-trade-phase	{}	2024-07-23 21:32:18.024	176
18	1	set-player-readiness	{"role": "Curator", "value": true}	2024-07-23 21:32:18.376	179
19	1	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-23 21:32:18.376	179
20	1	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-23 21:32:18.376	179
21	1	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-23 21:32:18.376	179
22	1	exited-trade-phase	{}	2024-07-23 21:32:20.708	177
23	1	entered-purchase-phase	{}	2024-07-23 21:32:20.708	177
24	1	exited-purchase-phase	{}	2024-07-23 21:32:20.912	60
25	1	entered-discard-phase	{}	2024-07-23 21:32:20.912	60
26	1	taken-round-snapshot	{"round": 1, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [93, 91, 89]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [32, 28, 37]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [69, 62, 76]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [5, 8, 14]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [55, 56, 50]}}}, "logsLength": 1, "marsEventIds": [], "systemHealth": 75, "messagesLength": 0, "marsEventsProcessed": 0}	2024-07-23 21:32:21.137	60
27	1	added-system-health-contributions	{}	2024-07-23 21:32:21.137	60
28	1	entered-new-round-phase	{}	2024-07-23 21:32:21.137	60
29	1	set-player-readiness	{"role": "Curator", "value": true}	2024-07-23 21:32:21.387	59
30	1	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-23 21:32:21.387	59
31	1	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-23 21:32:21.387	59
32	1	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-23 21:32:21.387	59
33	1	subtracted-system-health-wear-and-tear	{}	2024-07-23 21:32:21.977	59
34	1	entered-mars-event-phase	{}	2024-07-23 21:32:21.977	59
35	1	initialized-mars-event	{}	2024-07-23 21:32:21.977	59
36	1	set-player-readiness	{"role": "Curator", "value": true}	2024-07-23 21:32:22.354	9
37	1	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-23 21:32:22.354	9
38	1	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-23 21:32:22.354	9
39	1	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-23 21:32:22.354	9
40	1	set-player-readiness	{"role": "Politician", "value": true}	2024-07-23 21:32:25.207	7
41	1	finalized-mars-event	{}	2024-07-23 21:32:25.37	6
42	1	exited-mars-event-phase	{}	2024-07-23 21:32:25.37	6
43	1	entered-investment-phase	{}	2024-07-23 21:32:25.37	6
44	1	exited-investment-phase	{}	2024-07-23 21:32:26.258	180
45	1	entered-trade-phase	{}	2024-07-23 21:32:26.258	180
46	1	set-player-readiness	{"role": "Curator", "value": true}	2024-07-23 21:32:26.369	179
47	1	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-23 21:32:26.369	179
48	1	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-23 21:32:26.369	179
49	1	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-23 21:32:26.369	179
50	1	exited-trade-phase	{}	2024-07-23 21:32:26.758	179
51	1	entered-purchase-phase	{}	2024-07-23 21:32:26.758	179
52	1	exited-purchase-phase	{}	2024-07-23 21:32:26.841	60
53	1	entered-discard-phase	{}	2024-07-23 21:32:26.841	60
54	1	taken-round-snapshot	{"round": 2, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [93, 91, 89]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [32, 28, 37]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [69, 62, 76]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [5, 8, 14]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [55, 56, 50]}}}, "logsLength": 7, "marsEventIds": ["sandstorm"], "systemHealth": 64, "messagesLength": 0, "marsEventsProcessed": 0}	2024-07-23 21:32:26.924	60
55	1	added-system-health-contributions	{}	2024-07-23 21:32:26.924	60
56	1	entered-new-round-phase	{}	2024-07-23 21:32:26.924	60
57	1	subtracted-system-health-wear-and-tear	{}	2024-07-23 21:32:27.008	60
58	1	entered-mars-event-phase	{}	2024-07-23 21:32:27.008	60
59	1	initialized-mars-event	{}	2024-07-23 21:32:27.008	60
60	1	finalized-mars-event	{}	2024-07-23 21:32:27.091	10
61	1	reentered-mars-event-phase	{}	2024-07-23 21:32:27.091	10
62	1	initialized-mars-event	{}	2024-07-23 21:32:27.091	10
63	1	finalized-mars-event	{}	2024-07-23 21:32:27.176	10
64	1	reentered-mars-event-phase	{}	2024-07-23 21:32:27.176	10
65	1	initialized-mars-event	{}	2024-07-23 21:32:27.176	10
66	1	finalized-mars-event	{}	2024-07-23 21:32:27.263	15
67	1	reentered-mars-event-phase	{}	2024-07-23 21:32:27.263	15
68	1	initialized-mars-event	{}	2024-07-23 21:32:27.263	15
69	1	finalized-mars-event	{}	2024-07-23 21:32:27.342	10
70	1	reentered-mars-event-phase	{}	2024-07-23 21:32:27.342	10
71	1	initialized-mars-event	{}	2024-07-23 21:32:27.342	10
72	1	set-player-readiness	{"role": "Curator", "value": true}	2024-07-23 21:32:27.375	9
73	1	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-23 21:32:27.375	9
74	1	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-23 21:32:27.375	9
75	1	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-23 21:32:27.375	9
76	1	finalized-mars-event	{}	2024-07-23 21:32:27.425	9
77	1	exited-mars-event-phase	{}	2024-07-23 21:32:27.425	9
78	1	entered-investment-phase	{}	2024-07-23 21:32:27.425	9
79	1	exited-investment-phase	{}	2024-07-23 21:32:27.509	180
80	1	entered-trade-phase	{}	2024-07-23 21:32:27.509	180
81	1	exited-trade-phase	{}	2024-07-23 21:32:27.591	180
82	1	entered-purchase-phase	{}	2024-07-23 21:32:27.591	180
83	1	exited-purchase-phase	{}	2024-07-23 21:32:27.675	60
84	1	entered-discard-phase	{}	2024-07-23 21:32:27.675	60
85	1	taken-round-snapshot	{"round": 3, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [93, 91, 89]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [32, 28, 37]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [69, 62, 76]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [5, 8, 14]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [55, 56, 50]}}}, "logsLength": 17, "marsEventIds": ["sandstorm", "murphysLaw", "difficultConditions", "lifeAsUsual", "cropFailure"], "systemHealth": 9, "messagesLength": 0, "marsEventsProcessed": 4}	2024-07-23 21:32:27.76	60
86	1	added-system-health-contributions	{}	2024-07-23 21:32:27.76	60
87	1	entered-new-round-phase	{}	2024-07-23 21:32:27.76	60
88	1	subtracted-system-health-wear-and-tear	{}	2024-07-23 21:32:27.844	60
89	1	entered-mars-event-phase	{}	2024-07-23 21:32:27.844	60
90	1	initialized-mars-event	{}	2024-07-23 21:32:27.844	60
91	1	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-23 21:32:27.928	10
92	1	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-23 21:32:28.011	10000
93	1	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-23 21:32:28.095	10000
94	1	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-23 21:32:28.179	10000
95	1	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-23 21:32:28.263	10000
96	1	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-23 21:32:28.347	10000
97	3	taken-state-snapshot	{"logs": [], "phase": 0, "round": 1, "players": {"Curator": {"role": "Curator", "costs": {"legacy": 3, "culture": 2, "finance": 3, "science": 1000, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "LunarBison2329", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "culture", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Curator", "purchased": [], "remaining": [87, 89, 88, 95, 91, 82, 85, 90, 92, 81, 93], "purchasable": [96, 97, 94]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Pioneer": {"role": "Pioneer", "costs": {"legacy": 2, "culture": 3, "finance": 1000, "science": 3, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "AuroralCamel4881", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "legacy", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Pioneer", "purchased": [], "remaining": [27, 33, 34, 32, 22, 36, 29, 21, 30, 37, 31], "purchasable": [25, 35, 28]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Politician": {"role": "Politician", "costs": {"legacy": 1000, "culture": 1000, "finance": 3, "science": 3, "government": 2, "systemHealth": 1}, "isBot": false, "ready": false, "isMuted": false, "username": "InterstellarStarfish6735", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "government", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Politician", "purchased": [], "remaining": [68, 77, 67, 71, 72, 75, 62, 74, 70, 73, 76], "purchasable": [61, 65, 69]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Researcher": {"role": "Researcher", "costs": {"legacy": 3, "culture": 1000, "finance": 1000, "science": 2, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "SolarCamel3847", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "science", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Researcher", "purchased": [], "remaining": [5, 12, 8, 10, 17, 2, 7, 13, 11, 1, 9], "purchasable": [14, 15, 16]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Entrepreneur": {"role": "Entrepreneur", "costs": {"legacy": 1000, "culture": 3, "finance": 2, "science": 1000, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "MartianCamel3681", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "finance", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Entrepreneur", "purchased": [], "remaining": [57, 50, 53, 42, 49, 52, 41, 54, 47, 45, 55], "purchasable": [48, 51, 56]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}}, "winners": [], "maxRound": 10, "messages": [], "tradeSet": {}, "userRoles": {"LunarBison2329": "Curator", "SolarCamel3847": "Researcher", "AuroralCamel4881": "Pioneer", "MartianCamel3681": "Entrepreneur", "InterstellarStarfish6735": "Politician"}, "marsEvents": [], "heroOrPariah": "", "systemHealth": 100, "marsEventDeck": {"deck": [{"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "murphysLaw", "name": "Murphy's Law", "effect": "Reveal 2 more events. They're both in effect.", "duration": 1, "flavorText": "Residents at Port of Mars know better than to ask, \\"what ELSE could go wrong?\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionPolitician", "name": "Out of Commission", "effect": "The Politician receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "changingTides", "name": "Changing Tides", "effect": "Each player discards all of their available Accomplishments and draws 1 new Accomplishment. You will be able to discard this Accomplishment at the end of this round and draw up to three new Accomplishments at the start of the next round (if this is not the final round).", "duration": 1, "flavorText": "Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "stymied", "name": "Stymied", "effect": "Players may not earn their specialty Influence this round.", "duration": 1, "flavorText": "\\"That's very nice that you have three PhD's. Now pick up this toothbrush and help with cleaning our solar panel cells.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "marketsClosed", "name": "Markets Closed", "effect": "Players may not trade Influences this round.", "duration": 1, "flavorText": "\\"Trust is difficult to build and easy to break. Yet without it, this community would fall apart.\\" - The Curator", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "hullBreach", "name": "Hull Breach", "effect": "Destroy 7 System Health.", "duration": 1, "flavorText": "\\"Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "sandstorm", "name": "Sandstorm", "effect": "For the next 3 rounds, destroy an additional 10 System Health at the start of the round.", "duration": 3, "flavorText": "Buckle in - things are about to get rough. And coarse. And irritating.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionPioneer", "name": "Out of Commission", "effect": "The Pioneer receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "effortsWasted", "name": "Efforts Wasted", "effect": "Each player must discard an Accomplishment that they have already purchased.", "duration": 1, "flavorText": "\\"All markets are volatile. The trick is learning how to ride the waves.\\" - The Entrepreneur", "clientViewHandler": "ACCOMPLISHMENT_SELECT_PURCHASED"}, {"id": "outOfCommissionResearcher", "name": "Out of Commission", "effect": "The Researcher receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "solarFlare", "name": "Solar Flare", "effect": "Destroy 5 System Health. Skip discussion and trading phases this turn. Players cannot chat or trade Influences.", "duration": 1, "flavorText": "Solar flares pose a far greater threat on Mars, where a thin atmosphere and non-existent magnetic field leaves settlers more vulnerable. ", "timeDuration": 10, "clientViewHandler": "DISABLE_CHAT"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "heroOrPariah", "name": "Hero or Pariah", "effect": "CHOOSE ONE: Players must vote for 1 player to lose all Influence OR Players must vote for 1 player to gain 4 of their specialty Influence", "duration": 1, "flavorText": "In a community as small as Port of Mars, some individuals always stand out - for better or worse.", "clientViewHandler": "VOTE_FOR_PLAYER_HERO_PARIAH"}, {"id": "audit", "name": "Audit", "effect": "In this round, players will be able to view each other's accomplishments, inventories, resources and investment decisions.", "duration": 1, "flavorText": "\\"Of course we trust everyone to be truthful. But it doesn't hurt to check now and again.\\" - The Politician", "timeDuration": 10, "clientViewHandler": "AUDIT"}, {"id": "lostTime", "name": "Lost Time", "effect": "Each player has 5 fewer Time Blocks to spend this round.", "duration": 1, "flavorText": "Time flies when you're trying to stay alive.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "bondingThroughAdversity", "name": "Bonding Through Adversity", "effect": "Each player gains one unit of Influence of their choice.", "duration": 1, "flavorText": "Challenges brings communities together.", "clientViewHandler": "INFLUENCES_DRAW"}, {"id": "interdisciplinary", "name": "Interdisciplinary", "effect": "For this round, each player can spend 3 Time Blocks to earn an Influence in either of the 2 Influences they normally can't create.", "duration": 1, "flavorText": "\\"Everyone knows the saying, 'Jack of all trades, master of none.' Few remember the second part: 'still better than a master of one.'\\" - The Pioneer", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "compulsivePhilanthropy", "name": "Compulsive Philanthropy", "effect": "Players must vote for one player to put all their Time Blocks into System Health this round.", "duration": 1, "flavorText": "There's nothing quite like being volun-told for the greater good.", "clientViewHandler": "VOTE_FOR_PLAYER_SINGLE"}, {"id": "cropFailure", "name": "Crop Failure", "effect": "Destroy 20 System Health.", "duration": 1, "flavorText": "\\"The good news is we're not eating any more potatoes this cycle! The bad news is we're not sure what we're eating.\\" - The Researcher", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionEntrepreneur", "name": "Out of Commission", "effect": "The Entrepreneur receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "personalGain", "name": "Personal Gain", "effect": "Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 System Health.", "duration": 1, "flavorText": "It's easy to take risks when others are incurring the costs.", "clientViewHandler": "VOTE_YES_NO"}, {"id": "breakdownOfTrust", "name": "Breakdown of Trust", "effect": "Each player can choose to save up to 2 units of Influence that they already own. The rest will be lost.", "duration": 1, "flavorText": "Setbacks are inevitable, but no less painful each time.", "clientViewHandler": "INFLUENCES_SELECT"}, {"id": "difficultConditions", "name": "Difficult Conditions", "effect": "System Health costs twice as many Time Blocks as usual this round.", "duration": 1, "flavorText": "When one component breaks, it puts a strain on the rest of the system. Small failures often snowball into critical ones.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionCurator", "name": "Out of Commission", "effect": "The Curator receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}], "position": 0}, "timeRemaining": 60, "lastTimePolled": 1721872458478, "tradingEnabled": true, "roundIntroduction": {"completedTrades": [], "systemHealthMarsEvents": [], "accomplishmentPurchases": [], "systemHealthAtStartOfRound": 100, "systemHealthMaintenanceCost": -25, "systemHealthGroupContributions": {}}, "marsEventsProcessed": 0}	2024-07-25 01:54:18.504	60
98	3	set-player-readiness	{"role": "Curator", "value": true}	2024-07-25 01:54:19.493	59
99	3	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-25 01:54:19.493	59
100	3	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-25 01:54:19.493	59
101	3	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-25 01:54:19.493	59
102	3	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:54:36.703	42
103	3	entered-investment-phase	{}	2024-07-25 01:54:36.703	42
104	3	exited-investment-phase	{}	2024-07-25 01:54:37.199	180
105	3	entered-trade-phase	{}	2024-07-25 01:54:37.199	180
106	3	exited-trade-phase	{}	2024-07-25 01:54:37.281	180
107	3	entered-purchase-phase	{}	2024-07-25 01:54:37.281	180
108	3	exited-purchase-phase	{}	2024-07-25 01:54:37.368	60
109	3	entered-discard-phase	{}	2024-07-25 01:54:37.368	60
110	3	taken-round-snapshot	{"round": 1, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [96, 97, 94]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [25, 35, 28]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [61, 65, 69]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [14, 15, 16]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [48, 51, 56]}}}, "logsLength": 1, "marsEventIds": [], "systemHealth": 75, "messagesLength": 0, "marsEventsProcessed": 0}	2024-07-25 01:54:37.458	60
111	3	added-system-health-contributions	{}	2024-07-25 01:54:37.458	60
112	3	entered-new-round-phase	{}	2024-07-25 01:54:37.458	60
113	3	set-player-readiness	{"role": "Curator", "value": true}	2024-07-25 01:54:37.521	59
114	3	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-25 01:54:37.521	59
115	3	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-25 01:54:37.521	59
116	3	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-25 01:54:37.521	59
117	3	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:54:37.539	59
118	3	entered-mars-event-phase	{}	2024-07-25 01:54:37.539	59
119	3	initialized-mars-event	{}	2024-07-25 01:54:37.539	59
120	3	finalized-mars-event	{}	2024-07-25 01:54:37.621	10
121	3	reentered-mars-event-phase	{}	2024-07-25 01:54:37.621	10
122	3	initialized-mars-event	{}	2024-07-25 01:54:37.621	10
123	3	finalized-mars-event	{}	2024-07-25 01:54:37.705	10
124	3	exited-mars-event-phase	{}	2024-07-25 01:54:37.705	10
125	3	entered-investment-phase	{}	2024-07-25 01:54:37.705	10
126	3	exited-investment-phase	{}	2024-07-25 01:54:37.788	180
127	3	entered-trade-phase	{}	2024-07-25 01:54:37.788	180
128	3	exited-trade-phase	{}	2024-07-25 01:54:37.868	180
129	3	entered-purchase-phase	{}	2024-07-25 01:54:37.868	180
130	3	exited-purchase-phase	{}	2024-07-25 01:54:37.957	60
131	3	entered-discard-phase	{}	2024-07-25 01:54:37.957	60
132	3	taken-round-snapshot	{"round": 2, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [96, 97, 94]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [25, 35, 28]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [61, 65, 69]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [14, 15, 16]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [48, 51, 56]}}}, "logsLength": 8, "marsEventIds": ["lifeAsUsual", "lifeAsUsual"], "systemHealth": 50, "messagesLength": 0, "marsEventsProcessed": 1}	2024-07-25 01:54:38.041	60
133	3	added-system-health-contributions	{}	2024-07-25 01:54:38.041	60
134	3	entered-new-round-phase	{}	2024-07-25 01:54:38.041	60
135	3	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:54:38.118	60
136	3	entered-mars-event-phase	{}	2024-07-25 01:54:38.118	60
137	3	initialized-mars-event	{}	2024-07-25 01:54:38.118	60
138	3	finalized-mars-event	{}	2024-07-25 01:54:38.201	10
139	3	reentered-mars-event-phase	{}	2024-07-25 01:54:38.201	10
140	3	initialized-mars-event	{}	2024-07-25 01:54:38.201	10
141	3	finalized-mars-event	{}	2024-07-25 01:54:38.287	15
142	3	reentered-mars-event-phase	{}	2024-07-25 01:54:38.287	15
143	3	initialized-mars-event	{}	2024-07-25 01:54:38.287	15
144	3	finalized-mars-event	{}	2024-07-25 01:54:38.372	10
145	3	reentered-mars-event-phase	{}	2024-07-25 01:54:38.372	10
146	3	initialized-mars-event	{}	2024-07-25 01:54:38.372	10
147	3	finalized-mars-event	{}	2024-07-25 01:54:38.454	15
148	3	reentered-mars-event-phase	{}	2024-07-25 01:54:38.454	15
149	3	initialized-mars-event	{}	2024-07-25 01:54:38.454	15
150	3	set-player-readiness	{"role": "Curator", "value": true}	2024-07-25 01:54:38.517	9
151	3	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-25 01:54:38.517	9
152	3	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-25 01:54:38.517	9
153	3	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-25 01:54:38.517	9
154	3	finalized-mars-event	{}	2024-07-25 01:54:38.536	9
155	3	exited-mars-event-phase	{}	2024-07-25 01:54:38.536	9
156	3	entered-investment-phase	{}	2024-07-25 01:54:38.536	9
157	3	exited-investment-phase	{}	2024-07-25 01:54:38.618	180
158	3	entered-trade-phase	{}	2024-07-25 01:54:38.618	180
159	3	exited-trade-phase	{}	2024-07-25 01:54:38.703	180
160	3	entered-purchase-phase	{}	2024-07-25 01:54:38.703	180
161	3	exited-purchase-phase	{}	2024-07-25 01:54:38.791	60
162	3	entered-discard-phase	{}	2024-07-25 01:54:38.791	60
163	3	taken-round-snapshot	{"round": 3, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [87]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [27]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 3, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [68]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [5]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [57]}}}, "logsLength": 18, "marsEventIds": ["lifeAsUsual", "murphysLaw", "lifeAsUsual", "outOfCommissionPolitician", "changingTides"], "systemHealth": 25, "messagesLength": 0, "marsEventsProcessed": 4}	2024-07-25 01:54:38.869	60
164	3	added-system-health-contributions	{}	2024-07-25 01:54:38.869	60
165	3	entered-new-round-phase	{}	2024-07-25 01:54:38.869	60
166	3	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:54:38.956	60
167	3	entered-mars-event-phase	{}	2024-07-25 01:54:38.956	60
168	3	initialized-mars-event	{}	2024-07-25 01:54:38.956	60
169	3	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:54:39.036	10
170	3	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:54:39.12	10000
171	3	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:54:39.199	10000
172	3	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:54:39.284	10000
173	3	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:54:39.368	10000
174	3	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:54:39.451	10000
175	4	taken-state-snapshot	{"logs": [], "phase": 0, "round": 1, "players": {"Curator": {"role": "Curator", "costs": {"legacy": 3, "culture": 2, "finance": 3, "science": 1000, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "AuroralCamel4881", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "culture", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Curator", "purchased": [], "remaining": [85, 93, 96, 92, 82, 97, 81, 91, 89, 94, 88], "purchasable": [95, 90, 87]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Pioneer": {"role": "Pioneer", "costs": {"legacy": 2, "culture": 3, "finance": 1000, "science": 3, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "MartianCamel3681", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "legacy", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Pioneer", "purchased": [], "remaining": [29, 34, 37, 25, 32, 28, 36, 35, 27, 31, 22], "purchasable": [21, 30, 33]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Politician": {"role": "Politician", "costs": {"legacy": 1000, "culture": 1000, "finance": 3, "science": 3, "government": 2, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "SolarCamel3847", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "government", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Politician", "purchased": [], "remaining": [76, 65, 67, 62, 74, 73, 70, 77, 69, 61, 68], "purchasable": [75, 71, 72]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Researcher": {"role": "Researcher", "costs": {"legacy": 3, "culture": 1000, "finance": 1000, "science": 2, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "LunarBison2329", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "science", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Researcher", "purchased": [], "remaining": [9, 2, 10, 12, 1, 13, 15, 17, 16, 8, 7], "purchasable": [5, 14, 11]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Entrepreneur": {"role": "Entrepreneur", "costs": {"legacy": 1000, "culture": 3, "finance": 2, "science": 1000, "government": 3, "systemHealth": 1}, "isBot": false, "ready": false, "isMuted": false, "username": "SolarWolverine8632", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "finance", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Entrepreneur", "purchased": [], "remaining": [54, 45, 47, 55, 42, 53, 52, 48, 56, 41, 49], "purchasable": [57, 50, 51]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}}, "winners": [], "maxRound": 10, "messages": [], "tradeSet": {}, "userRoles": {"LunarBison2329": "Researcher", "SolarCamel3847": "Politician", "AuroralCamel4881": "Curator", "MartianCamel3681": "Pioneer", "SolarWolverine8632": "Entrepreneur"}, "marsEvents": [], "heroOrPariah": "", "systemHealth": 100, "marsEventDeck": {"deck": [{"id": "solarFlare", "name": "Solar Flare", "effect": "Destroy 5 System Health. Skip discussion and trading phases this turn. Players cannot chat or trade Influences.", "duration": 1, "flavorText": "Solar flares pose a far greater threat on Mars, where a thin atmosphere and non-existent magnetic field leaves settlers more vulnerable. ", "timeDuration": 10, "clientViewHandler": "DISABLE_CHAT"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionResearcher", "name": "Out of Commission", "effect": "The Researcher receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionEntrepreneur", "name": "Out of Commission", "effect": "The Entrepreneur receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "compulsivePhilanthropy", "name": "Compulsive Philanthropy", "effect": "Players must vote for one player to put all their Time Blocks into System Health this round.", "duration": 1, "flavorText": "There's nothing quite like being volun-told for the greater good.", "clientViewHandler": "VOTE_FOR_PLAYER_SINGLE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "interdisciplinary", "name": "Interdisciplinary", "effect": "For this round, each player can spend 3 Time Blocks to earn an Influence in either of the 2 Influences they normally can't create.", "duration": 1, "flavorText": "\\"Everyone knows the saying, 'Jack of all trades, master of none.' Few remember the second part: 'still better than a master of one.'\\" - The Pioneer", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "bondingThroughAdversity", "name": "Bonding Through Adversity", "effect": "Each player gains one unit of Influence of their choice.", "duration": 1, "flavorText": "Challenges brings communities together.", "clientViewHandler": "INFLUENCES_DRAW"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "changingTides", "name": "Changing Tides", "effect": "Each player discards all of their available Accomplishments and draws 1 new Accomplishment. You will be able to discard this Accomplishment at the end of this round and draw up to three new Accomplishments at the start of the next round (if this is not the final round).", "duration": 1, "flavorText": "Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionPolitician", "name": "Out of Commission", "effect": "The Politician receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionPioneer", "name": "Out of Commission", "effect": "The Pioneer receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "personalGain", "name": "Personal Gain", "effect": "Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 System Health.", "duration": 1, "flavorText": "It's easy to take risks when others are incurring the costs.", "clientViewHandler": "VOTE_YES_NO"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionCurator", "name": "Out of Commission", "effect": "The Curator receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "hullBreach", "name": "Hull Breach", "effect": "Destroy 7 System Health.", "duration": 1, "flavorText": "\\"Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "murphysLaw", "name": "Murphy's Law", "effect": "Reveal 2 more events. They're both in effect.", "duration": 1, "flavorText": "Residents at Port of Mars know better than to ask, \\"what ELSE could go wrong?\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lostTime", "name": "Lost Time", "effect": "Each player has 5 fewer Time Blocks to spend this round.", "duration": 1, "flavorText": "Time flies when you're trying to stay alive.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "cropFailure", "name": "Crop Failure", "effect": "Destroy 20 System Health.", "duration": 1, "flavorText": "\\"The good news is we're not eating any more potatoes this cycle! The bad news is we're not sure what we're eating.\\" - The Researcher", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "stymied", "name": "Stymied", "effect": "Players may not earn their specialty Influence this round.", "duration": 1, "flavorText": "\\"That's very nice that you have three PhD's. Now pick up this toothbrush and help with cleaning our solar panel cells.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "difficultConditions", "name": "Difficult Conditions", "effect": "System Health costs twice as many Time Blocks as usual this round.", "duration": 1, "flavorText": "When one component breaks, it puts a strain on the rest of the system. Small failures often snowball into critical ones.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "heroOrPariah", "name": "Hero or Pariah", "effect": "CHOOSE ONE: Players must vote for 1 player to lose all Influence OR Players must vote for 1 player to gain 4 of their specialty Influence", "duration": 1, "flavorText": "In a community as small as Port of Mars, some individuals always stand out - for better or worse.", "clientViewHandler": "VOTE_FOR_PLAYER_HERO_PARIAH"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "effortsWasted", "name": "Efforts Wasted", "effect": "Each player must discard an Accomplishment that they have already purchased.", "duration": 1, "flavorText": "\\"All markets are volatile. The trick is learning how to ride the waves.\\" - The Entrepreneur", "clientViewHandler": "ACCOMPLISHMENT_SELECT_PURCHASED"}, {"id": "marketsClosed", "name": "Markets Closed", "effect": "Players may not trade Influences this round.", "duration": 1, "flavorText": "\\"Trust is difficult to build and easy to break. Yet without it, this community would fall apart.\\" - The Curator", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "sandstorm", "name": "Sandstorm", "effect": "For the next 3 rounds, destroy an additional 10 System Health at the start of the round.", "duration": 3, "flavorText": "Buckle in - things are about to get rough. And coarse. And irritating.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "audit", "name": "Audit", "effect": "In this round, players will be able to view each other's accomplishments, inventories, resources and investment decisions.", "duration": 1, "flavorText": "\\"Of course we trust everyone to be truthful. But it doesn't hurt to check now and again.\\" - The Politician", "timeDuration": 10, "clientViewHandler": "AUDIT"}, {"id": "breakdownOfTrust", "name": "Breakdown of Trust", "effect": "Each player can choose to save up to 2 units of Influence that they already own. The rest will be lost.", "duration": 1, "flavorText": "Setbacks are inevitable, but no less painful each time.", "clientViewHandler": "INFLUENCES_SELECT"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}], "position": 0}, "timeRemaining": 60, "lastTimePolled": 1721872506665, "tradingEnabled": true, "roundIntroduction": {"completedTrades": [], "systemHealthMarsEvents": [], "accomplishmentPurchases": [], "systemHealthAtStartOfRound": 100, "systemHealthMaintenanceCost": -25, "systemHealthGroupContributions": {}}, "marsEventsProcessed": 0}	2024-07-25 01:55:06.687	60
176	4	set-player-readiness	{"role": "Curator", "value": true}	2024-07-25 01:55:07.69	59
177	4	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-25 01:55:07.69	59
178	4	set-player-readiness	{"role": "Politician", "value": true}	2024-07-25 01:55:07.69	59
179	4	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-25 01:55:07.69	59
180	4	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:55:18.462	49
181	4	entered-investment-phase	{}	2024-07-25 01:55:18.462	49
182	4	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-25 01:55:18.677	179
183	4	set-player-readiness	{"role": "Curator", "value": true}	2024-07-25 01:55:18.677	179
184	4	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-25 01:55:18.677	179
185	4	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-25 01:55:18.677	179
186	4	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-25 01:55:18.677	179
187	4	set-player-readiness	{"role": "Politician", "value": true}	2024-07-25 01:55:18.677	179
188	4	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-25 01:55:18.677	179
189	4	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-25 01:55:18.677	179
190	4	exited-investment-phase	{}	2024-07-25 01:55:18.963	179
191	4	entered-trade-phase	{}	2024-07-25 01:55:18.963	179
192	4	exited-trade-phase	{}	2024-07-25 01:55:19.051	180
193	4	entered-purchase-phase	{}	2024-07-25 01:55:19.051	180
194	4	exited-purchase-phase	{}	2024-07-25 01:55:19.128	60
195	4	entered-discard-phase	{}	2024-07-25 01:55:19.128	60
196	4	taken-round-snapshot	{"round": 1, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [95, 90, 87]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [21, 30, 33]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [75, 71, 72]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [5, 14, 11]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [57, 50, 51]}}}, "logsLength": 1, "marsEventIds": [], "systemHealth": 75, "messagesLength": 0, "marsEventsProcessed": 0}	2024-07-25 01:55:19.211	60
197	4	added-system-health-contributions	{}	2024-07-25 01:55:19.211	60
198	4	entered-new-round-phase	{}	2024-07-25 01:55:19.211	60
199	4	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:55:19.296	60
200	4	entered-mars-event-phase	{}	2024-07-25 01:55:19.296	60
201	4	initialized-mars-event	{}	2024-07-25 01:55:19.296	60
202	4	finalized-mars-event	{}	2024-07-25 01:55:19.378	10
203	4	exited-mars-event-phase	{}	2024-07-25 01:55:19.378	10
204	4	entered-investment-phase	{}	2024-07-25 01:55:19.378	10
205	4	exited-investment-phase	{}	2024-07-25 01:55:19.463	180
206	4	entered-purchase-phase	{}	2024-07-25 01:55:19.463	180
207	4	exited-purchase-phase	{}	2024-07-25 01:55:19.546	60
208	4	entered-discard-phase	{}	2024-07-25 01:55:19.546	60
209	4	taken-round-snapshot	{"round": 2, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [95, 90, 87]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [21, 30, 33]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [75, 71, 72]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [5, 14, 11]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [57, 50, 51]}}}, "logsLength": 7, "marsEventIds": ["solarFlare"], "systemHealth": 69, "messagesLength": 0, "marsEventsProcessed": 0}	2024-07-25 01:55:19.629	60
210	4	added-system-health-contributions	{}	2024-07-25 01:55:19.629	60
211	4	entered-new-round-phase	{}	2024-07-25 01:55:19.629	60
212	4	set-player-readiness	{"role": "Curator", "value": true}	2024-07-25 01:55:19.688	59
213	4	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-25 01:55:19.688	59
214	4	set-player-readiness	{"role": "Politician", "value": true}	2024-07-25 01:55:19.688	59
215	4	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-25 01:55:19.688	59
216	4	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:55:19.712	59
217	4	entered-mars-event-phase	{}	2024-07-25 01:55:19.712	59
218	4	initialized-mars-event	{}	2024-07-25 01:55:19.712	59
219	4	finalized-mars-event	{}	2024-07-25 01:55:19.801	10
220	4	reentered-mars-event-phase	{}	2024-07-25 01:55:19.801	10
221	4	initialized-mars-event	{}	2024-07-25 01:55:19.801	10
222	4	finalized-mars-event	{}	2024-07-25 01:55:19.885	15
223	4	exited-mars-event-phase	{}	2024-07-25 01:55:19.885	15
224	4	entered-investment-phase	{}	2024-07-25 01:55:19.885	15
225	4	exited-investment-phase	{}	2024-07-25 01:55:19.969	180
226	4	entered-trade-phase	{}	2024-07-25 01:55:19.969	180
227	4	exited-trade-phase	{}	2024-07-25 01:55:20.053	180
228	4	entered-purchase-phase	{}	2024-07-25 01:55:20.053	180
229	4	exited-purchase-phase	{}	2024-07-25 01:55:20.135	60
230	4	entered-discard-phase	{}	2024-07-25 01:55:20.135	60
231	4	taken-round-snapshot	{"round": 3, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [95, 90, 87]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [21, 30, 33]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [75, 71, 72]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 3, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [5, 14, 11]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [57, 50, 51]}}}, "logsLength": 14, "marsEventIds": ["lifeAsUsual", "outOfCommissionResearcher"], "systemHealth": 44, "messagesLength": 0, "marsEventsProcessed": 1}	2024-07-25 01:55:20.22	60
232	4	added-system-health-contributions	{}	2024-07-25 01:55:20.22	60
233	4	entered-new-round-phase	{}	2024-07-25 01:55:20.22	60
234	4	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:55:20.304	60
235	4	entered-mars-event-phase	{}	2024-07-25 01:55:20.304	60
236	4	initialized-mars-event	{}	2024-07-25 01:55:20.304	60
237	4	finalized-mars-event	{}	2024-07-25 01:55:20.386	15
238	4	reentered-mars-event-phase	{}	2024-07-25 01:55:20.386	15
239	4	initialized-mars-event	{}	2024-07-25 01:55:20.386	15
240	4	finalized-mars-event	{}	2024-07-25 01:55:20.483	10
241	4	reentered-mars-event-phase	{}	2024-07-25 01:55:20.483	10
242	4	initialized-mars-event	{}	2024-07-25 01:55:20.483	10
243	4	finalized-mars-event	{}	2024-07-25 01:55:20.553	10
244	4	exited-mars-event-phase	{}	2024-07-25 01:55:20.553	10
245	4	entered-investment-phase	{}	2024-07-25 01:55:20.553	10
246	4	exited-investment-phase	{}	2024-07-25 01:55:20.635	180
247	4	entered-trade-phase	{}	2024-07-25 01:55:20.635	180
248	4	set-player-readiness	{"role": "Curator", "value": true}	2024-07-25 01:55:20.693	179
249	4	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-25 01:55:20.693	179
250	4	set-player-readiness	{"role": "Politician", "value": true}	2024-07-25 01:55:20.693	179
251	4	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-25 01:55:20.693	179
252	4	exited-trade-phase	{}	2024-07-25 01:55:20.718	179
253	4	entered-purchase-phase	{}	2024-07-25 01:55:20.718	179
254	4	exited-purchase-phase	{}	2024-07-25 01:55:20.802	60
255	4	entered-discard-phase	{}	2024-07-25 01:55:20.802	60
310	5	discarded-accomplishment	{"id": 57, "role": "Entrepreneur"}	2024-07-26 23:05:06.726	59
311	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:06.726	59
312	5	discarded-accomplishment	{"id": 27, "role": "Pioneer"}	2024-07-26 23:05:06.726	59
313	5	discarded-accomplishment	{"id": 33, "role": "Pioneer"}	2024-07-26 23:05:06.726	59
644	6	exited-mars-event-phase	{}	2024-07-31 01:03:29.723	14
256	4	taken-round-snapshot	{"round": 4, "players": {"Curator": {"role": "Curator", "ready": false, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [95, 90, 87]}}, "Pioneer": {"role": "Pioneer", "ready": false, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [21, 30, 33]}}, "Politician": {"role": "Politician", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [75, 71, 72]}}, "Researcher": {"role": "Researcher", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [5, 14, 11]}}, "Entrepreneur": {"role": "Entrepreneur", "ready": false, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 3, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": [57, 50, 51]}}}, "logsLength": 22, "marsEventIds": ["outOfCommissionEntrepreneur", "lifeAsUsual", "lifeAsUsual"], "systemHealth": 19, "messagesLength": 0, "marsEventsProcessed": 2}	2024-07-25 01:55:20.889	60
257	4	added-system-health-contributions	{}	2024-07-25 01:55:20.889	60
258	4	entered-new-round-phase	{}	2024-07-25 01:55:20.889	60
259	4	subtracted-system-health-wear-and-tear	{}	2024-07-25 01:55:20.968	60
260	4	entered-mars-event-phase	{}	2024-07-25 01:55:20.968	60
261	4	initialized-mars-event	{}	2024-07-25 01:55:20.968	60
262	4	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:55:21.051	90
263	4	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:55:21.13	10000
264	4	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:55:21.215	10000
265	4	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:55:21.299	10000
266	4	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:55:21.383	10000
267	4	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:55:21.473	10000
268	4	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:55:21.552	10000
269	4	entered-defeat-phase	{"Curator": 0, "Pioneer": 0, "Politician": 0, "Researcher": 0, "Entrepreneur": 0}	2024-07-25 01:55:21.635	10000
270	5	taken-state-snapshot	{"logs": [], "phase": 0, "round": 1, "players": {"Curator": {"role": "Curator", "costs": {"legacy": 3, "culture": 2, "finance": 3, "science": 1000, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "MartianCamel3681", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "culture", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Curator", "purchased": [], "remaining": [95, 92, 82, 88, 97, 85, 87, 96, 89, 94, 81], "purchasable": [91, 90, 93]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Pioneer": {"role": "Pioneer", "costs": {"legacy": 2, "culture": 3, "finance": 1000, "science": 3, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "LunarBison2329", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "legacy", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Pioneer", "purchased": [], "remaining": [36, 32, 25, 30, 35, 21, 28, 29, 37, 31, 22], "purchasable": [34, 27, 33]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Politician": {"role": "Politician", "costs": {"legacy": 1000, "culture": 1000, "finance": 3, "science": 3, "government": 2, "systemHealth": 1}, "isBot": false, "ready": false, "isMuted": false, "username": "PlanetaryQuagga6458", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "government", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Politician", "purchased": [], "remaining": [62, 61, 73, 72, 76, 71, 68, 70, 74, 65, 75], "purchasable": [67, 77, 69]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Researcher": {"role": "Researcher", "costs": {"legacy": 3, "culture": 1000, "finance": 1000, "science": 2, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "AuroralCamel4881", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "science", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Researcher", "purchased": [], "remaining": [1, 13, 15, 12, 9, 5, 17, 7, 16, 10, 11], "purchasable": [8, 2, 14]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Entrepreneur": {"role": "Entrepreneur", "costs": {"legacy": 1000, "culture": 3, "finance": 2, "science": 1000, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "SolarCamel3847", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "finance", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Entrepreneur", "purchased": [], "remaining": [48, 45, 53, 56, 51, 47, 52, 50, 49, 42, 54], "purchasable": [55, 41, 57]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}}, "winners": [], "maxRound": 10, "messages": [], "tradeSet": {}, "userRoles": {"LunarBison2329": "Pioneer", "SolarCamel3847": "Entrepreneur", "AuroralCamel4881": "Researcher", "MartianCamel3681": "Curator", "PlanetaryQuagga6458": "Politician"}, "marsEvents": [], "heroOrPariah": "", "systemHealth": 100, "marsEventDeck": {"deck": [{"id": "effortsWasted", "name": "Efforts Wasted", "effect": "Each player must discard an Accomplishment that they have already purchased.", "duration": 1, "flavorText": "\\"All markets are volatile. The trick is learning how to ride the waves.\\" - The Entrepreneur", "clientViewHandler": "ACCOMPLISHMENT_SELECT_PURCHASED"}, {"id": "outOfCommissionPolitician", "name": "Out of Commission", "effect": "The Politician receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionEntrepreneur", "name": "Out of Commission", "effect": "The Entrepreneur receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "difficultConditions", "name": "Difficult Conditions", "effect": "System Health costs twice as many Time Blocks as usual this round.", "duration": 1, "flavorText": "When one component breaks, it puts a strain on the rest of the system. Small failures often snowball into critical ones.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "cropFailure", "name": "Crop Failure", "effect": "Destroy 20 System Health.", "duration": 1, "flavorText": "\\"The good news is we're not eating any more potatoes this cycle! The bad news is we're not sure what we're eating.\\" - The Researcher", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "personalGain", "name": "Personal Gain", "effect": "Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 System Health.", "duration": 1, "flavorText": "It's easy to take risks when others are incurring the costs.", "clientViewHandler": "VOTE_YES_NO"}, {"id": "bondingThroughAdversity", "name": "Bonding Through Adversity", "effect": "Each player gains one unit of Influence of their choice.", "duration": 1, "flavorText": "Challenges brings communities together.", "clientViewHandler": "INFLUENCES_DRAW"}, {"id": "changingTides", "name": "Changing Tides", "effect": "Each player discards all of their available Accomplishments and draws 1 new Accomplishment. You will be able to discard this Accomplishment at the end of this round and draw up to three new Accomplishments at the start of the next round (if this is not the final round).", "duration": 1, "flavorText": "Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "solarFlare", "name": "Solar Flare", "effect": "Destroy 5 System Health. Skip discussion and trading phases this turn. Players cannot chat or trade Influences.", "duration": 1, "flavorText": "Solar flares pose a far greater threat on Mars, where a thin atmosphere and non-existent magnetic field leaves settlers more vulnerable. ", "timeDuration": 10, "clientViewHandler": "DISABLE_CHAT"}, {"id": "hullBreach", "name": "Hull Breach", "effect": "Destroy 7 System Health.", "duration": 1, "flavorText": "\\"Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "interdisciplinary", "name": "Interdisciplinary", "effect": "For this round, each player can spend 3 Time Blocks to earn an Influence in either of the 2 Influences they normally can't create.", "duration": 1, "flavorText": "\\"Everyone knows the saying, 'Jack of all trades, master of none.' Few remember the second part: 'still better than a master of one.'\\" - The Pioneer", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "marketsClosed", "name": "Markets Closed", "effect": "Players may not trade Influences this round.", "duration": 1, "flavorText": "\\"Trust is difficult to build and easy to break. Yet without it, this community would fall apart.\\" - The Curator", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionCurator", "name": "Out of Commission", "effect": "The Curator receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lostTime", "name": "Lost Time", "effect": "Each player has 5 fewer Time Blocks to spend this round.", "duration": 1, "flavorText": "Time flies when you're trying to stay alive.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "heroOrPariah", "name": "Hero or Pariah", "effect": "CHOOSE ONE: Players must vote for 1 player to lose all Influence OR Players must vote for 1 player to gain 4 of their specialty Influence", "duration": 1, "flavorText": "In a community as small as Port of Mars, some individuals always stand out - for better or worse.", "clientViewHandler": "VOTE_FOR_PLAYER_HERO_PARIAH"}, {"id": "outOfCommissionResearcher", "name": "Out of Commission", "effect": "The Researcher receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "breakdownOfTrust", "name": "Breakdown of Trust", "effect": "Each player can choose to save up to 2 units of Influence that they already own. The rest will be lost.", "duration": 1, "flavorText": "Setbacks are inevitable, but no less painful each time.", "clientViewHandler": "INFLUENCES_SELECT"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "stymied", "name": "Stymied", "effect": "Players may not earn their specialty Influence this round.", "duration": 1, "flavorText": "\\"That's very nice that you have three PhD's. Now pick up this toothbrush and help with cleaning our solar panel cells.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "compulsivePhilanthropy", "name": "Compulsive Philanthropy", "effect": "Players must vote for one player to put all their Time Blocks into System Health this round.", "duration": 1, "flavorText": "There's nothing quite like being volun-told for the greater good.", "clientViewHandler": "VOTE_FOR_PLAYER_SINGLE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "sandstorm", "name": "Sandstorm", "effect": "For the next 3 rounds, destroy an additional 10 System Health at the start of the round.", "duration": 3, "flavorText": "Buckle in - things are about to get rough. And coarse. And irritating.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "audit", "name": "Audit", "effect": "In this round, players will be able to view each other's accomplishments, inventories, resources and investment decisions.", "duration": 1, "flavorText": "\\"Of course we trust everyone to be truthful. But it doesn't hurt to check now and again.\\" - The Politician", "timeDuration": 10, "clientViewHandler": "AUDIT"}, {"id": "murphysLaw", "name": "Murphy's Law", "effect": "Reveal 2 more events. They're both in effect.", "duration": 1, "flavorText": "Residents at Port of Mars know better than to ask, \\"what ELSE could go wrong?\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionPioneer", "name": "Out of Commission", "effect": "The Pioneer receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}], "position": 0}, "timeRemaining": 60, "lastTimePolled": 1722034802722, "tradingEnabled": true, "roundIntroduction": {"completedTrades": [], "systemHealthMarsEvents": [], "accomplishmentPurchases": [], "systemHealthAtStartOfRound": 100, "systemHealthMaintenanceCost": -25, "systemHealthGroupContributions": {}}, "marsEventsProcessed": 0}	2024-07-26 23:00:02.756	60
271	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:00:03.727	59
272	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:00:03.727	59
273	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:00:03.727	59
274	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:00:03.727	59
275	5	subtracted-system-health-wear-and-tear	{}	2024-07-26 23:01:02.759	0
276	5	entered-investment-phase	{}	2024-07-26 23:01:02.759	0
277	5	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-26 23:01:03.775	179
278	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:01:03.775	179
279	5	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-26 23:01:03.775	179
280	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:01:03.775	179
281	5	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-26 23:01:03.775	179
282	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:01:03.775	179
283	5	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-26 23:01:03.775	179
284	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:01:03.775	179
285	5	exited-investment-phase	{}	2024-07-26 23:04:02.752	0
286	5	entered-trade-phase	{}	2024-07-26 23:04:02.752	0
287	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:04:03.777	179
288	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:04:03.777	179
289	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:04:03.777	179
290	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:04:03.777	179
291	5	bot-control-taken	{"role": "Politician"}	2024-07-26 23:05:02.739	120
292	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:03.727	119
293	5	exited-trade-phase	{}	2024-07-26 23:05:03.727	119
294	5	entered-purchase-phase	{}	2024-07-26 23:05:03.727	119
295	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:04.732	59
296	5	purchased-accomplishment	{"role": "Entrepreneur", "accomplishment": {"id": 55, "role": "Entrepreneur"}}	2024-07-26 23:05:04.732	59
297	5	purchased-accomplishment	{"role": "Pioneer", "accomplishment": {"id": 34, "role": "Pioneer"}}	2024-07-26 23:05:04.732	59
298	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:04.732	59
299	5	purchased-accomplishment	{"role": "Researcher", "accomplishment": {"id": 14, "role": "Researcher"}}	2024-07-26 23:05:04.732	59
300	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:05.755	58
301	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:05.755	58
302	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:05.755	58
303	5	exited-purchase-phase	{}	2024-07-26 23:05:05.755	58
304	5	entered-discard-phase	{}	2024-07-26 23:05:05.755	58
305	5	discarded-accomplishment	{"id": 91, "role": "Curator"}	2024-07-26 23:05:06.726	59
306	5	discarded-accomplishment	{"id": 90, "role": "Curator"}	2024-07-26 23:05:06.726	59
307	5	discarded-accomplishment	{"id": 93, "role": "Curator"}	2024-07-26 23:05:06.726	59
308	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:06.726	59
309	5	discarded-accomplishment	{"id": 41, "role": "Entrepreneur"}	2024-07-26 23:05:06.726	59
421	5	initialized-mars-event	{}	2024-07-26 23:05:17.725	9
314	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:06.726	59
315	5	discarded-accomplishment	{"id": 67, "role": "Politician"}	2024-07-26 23:05:06.726	59
316	5	discarded-accomplishment	{"id": 77, "role": "Politician"}	2024-07-26 23:05:06.726	59
317	5	discarded-accomplishment	{"id": 69, "role": "Politician"}	2024-07-26 23:05:06.726	59
318	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:06.726	59
319	5	discarded-accomplishment	{"id": 8, "role": "Researcher"}	2024-07-26 23:05:06.726	59
320	5	discarded-accomplishment	{"id": 2, "role": "Researcher"}	2024-07-26 23:05:06.726	59
321	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:06.726	59
322	5	taken-round-snapshot	{"round": 1, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [34], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [14], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [55], "purchasable": []}}}, "logsLength": 4, "marsEventIds": [], "systemHealth": 75, "messagesLength": 0, "marsEventsProcessed": 0}	2024-07-26 23:05:06.726	59
323	5	added-system-health-contributions	{}	2024-07-26 23:05:06.726	59
324	5	entered-new-round-phase	{}	2024-07-26 23:05:06.726	59
325	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:07.751	59
326	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:07.751	59
327	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:07.751	59
328	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:07.751	59
329	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:07.751	59
330	5	subtracted-system-health-wear-and-tear	{}	2024-07-26 23:05:07.751	59
331	5	entered-mars-event-phase	{}	2024-07-26 23:05:07.751	59
332	5	initialized-mars-event	{}	2024-07-26 23:05:07.751	59
333	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:08.755	89
334	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:08.755	89
335	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:08.755	89
336	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:08.755	89
337	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:08.755	89
338	5	finalized-mars-event	{}	2024-07-26 23:05:08.755	89
339	5	reentered-mars-event-phase	{}	2024-07-26 23:05:08.755	89
340	5	initialized-mars-event	{}	2024-07-26 23:05:08.755	89
341	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:09.75	14
342	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:09.75	14
343	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:09.75	14
344	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:09.75	14
345	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:09.75	14
346	5	finalized-mars-event	{}	2024-07-26 23:05:09.75	14
347	5	exited-mars-event-phase	{}	2024-07-26 23:05:09.75	14
348	5	entered-investment-phase	{}	2024-07-26 23:05:09.75	14
349	5	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-26 23:05:10.773	179
350	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:10.773	179
351	5	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-26 23:05:10.773	179
352	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:10.773	179
353	5	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-26 23:05:10.773	179
354	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:10.773	179
355	5	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 3}}	2024-07-26 23:05:10.773	179
356	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:10.773	179
357	5	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-26 23:05:10.773	179
358	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:10.773	179
359	5	exited-investment-phase	{}	2024-07-26 23:05:10.773	179
360	5	entered-trade-phase	{}	2024-07-26 23:05:10.773	179
361	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:11.746	179
362	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:11.746	179
363	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:11.746	179
364	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:11.746	179
365	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:11.746	179
366	5	exited-trade-phase	{}	2024-07-26 23:05:11.746	179
367	5	entered-purchase-phase	{}	2024-07-26 23:05:11.746	179
368	5	purchased-accomplishment	{"role": "Curator", "accomplishment": {"id": 95, "role": "Curator"}}	2024-07-26 23:05:12.727	59
369	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:12.727	59
370	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:12.727	59
371	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:12.727	59
372	5	purchased-accomplishment	{"role": "Researcher", "accomplishment": {"id": 15, "role": "Researcher"}}	2024-07-26 23:05:12.727	59
373	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:13.767	58
374	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:13.767	58
375	5	exited-purchase-phase	{}	2024-07-26 23:05:13.767	58
376	5	entered-discard-phase	{}	2024-07-26 23:05:13.767	58
377	5	discarded-accomplishment	{"id": 92, "role": "Curator"}	2024-07-26 23:05:14.729	59
378	5	discarded-accomplishment	{"id": 82, "role": "Curator"}	2024-07-26 23:05:14.729	59
379	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:14.729	59
380	5	discarded-accomplishment	{"id": 48, "role": "Entrepreneur"}	2024-07-26 23:05:14.729	59
381	5	discarded-accomplishment	{"id": 45, "role": "Entrepreneur"}	2024-07-26 23:05:14.729	59
382	5	discarded-accomplishment	{"id": 53, "role": "Entrepreneur"}	2024-07-26 23:05:14.729	59
383	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:14.729	59
384	5	discarded-accomplishment	{"id": 36, "role": "Pioneer"}	2024-07-26 23:05:14.729	59
385	5	discarded-accomplishment	{"id": 32, "role": "Pioneer"}	2024-07-26 23:05:14.729	59
386	5	discarded-accomplishment	{"id": 25, "role": "Pioneer"}	2024-07-26 23:05:14.729	59
387	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:14.729	59
388	5	discarded-accomplishment	{"id": 62, "role": "Politician"}	2024-07-26 23:05:14.729	59
389	5	discarded-accomplishment	{"id": 61, "role": "Politician"}	2024-07-26 23:05:14.729	59
390	5	discarded-accomplishment	{"id": 73, "role": "Politician"}	2024-07-26 23:05:14.729	59
391	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:14.729	59
392	5	discarded-accomplishment	{"id": 1, "role": "Researcher"}	2024-07-26 23:05:14.729	59
393	5	discarded-accomplishment	{"id": 13, "role": "Researcher"}	2024-07-26 23:05:14.729	59
394	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:14.729	59
395	5	taken-round-snapshot	{"round": 2, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 4, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [95], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 4, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 3, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 4, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [15], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 4, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}}, "logsLength": 14, "marsEventIds": ["effortsWasted", "outOfCommissionPolitician"], "systemHealth": 49, "messagesLength": 0, "marsEventsProcessed": 1}	2024-07-26 23:05:14.729	59
396	5	added-system-health-contributions	{}	2024-07-26 23:05:14.729	59
397	5	entered-new-round-phase	{}	2024-07-26 23:05:14.729	59
398	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:15.74	59
399	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:15.74	59
400	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:15.74	59
401	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:15.74	59
402	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:15.74	59
403	5	subtracted-system-health-wear-and-tear	{}	2024-07-26 23:05:15.74	59
404	5	entered-mars-event-phase	{}	2024-07-26 23:05:15.74	59
405	5	initialized-mars-event	{}	2024-07-26 23:05:15.74	59
406	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:16.766	9
407	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:16.766	9
408	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:16.766	9
409	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:16.766	9
410	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:16.766	9
411	5	finalized-mars-event	{}	2024-07-26 23:05:16.766	9
412	5	reentered-mars-event-phase	{}	2024-07-26 23:05:16.766	9
413	5	initialized-mars-event	{}	2024-07-26 23:05:16.766	9
414	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:17.725	9
415	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:17.725	9
416	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:17.725	9
417	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:17.725	9
418	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:17.725	9
419	5	finalized-mars-event	{}	2024-07-26 23:05:17.725	9
420	5	reentered-mars-event-phase	{}	2024-07-26 23:05:17.725	9
422	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:18.746	14
423	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:18.746	14
424	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:18.746	14
425	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:18.746	14
426	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:18.746	14
427	5	finalized-mars-event	{}	2024-07-26 23:05:18.746	14
428	5	exited-mars-event-phase	{}	2024-07-26 23:05:18.746	14
429	5	entered-investment-phase	{}	2024-07-26 23:05:18.746	14
430	5	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-26 23:05:19.769	179
431	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:19.769	179
432	5	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 3}}	2024-07-26 23:05:19.769	179
433	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:19.769	179
434	5	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-26 23:05:19.769	179
435	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:19.769	179
436	5	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-26 23:05:19.769	179
437	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:19.769	179
438	5	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-26 23:05:19.769	179
439	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:19.769	179
440	5	exited-investment-phase	{}	2024-07-26 23:05:19.769	179
441	5	entered-trade-phase	{}	2024-07-26 23:05:19.769	179
442	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:20.751	179
443	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:20.751	179
444	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:20.751	179
445	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:20.751	179
446	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:20.751	179
447	5	exited-trade-phase	{}	2024-07-26 23:05:20.751	179
448	5	entered-purchase-phase	{}	2024-07-26 23:05:20.751	179
449	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:21.765	59
450	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:21.765	59
451	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:21.765	59
452	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:21.765	59
453	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:21.765	59
454	5	exited-purchase-phase	{}	2024-07-26 23:05:21.765	59
455	5	entered-discard-phase	{}	2024-07-26 23:05:21.765	59
456	5	discarded-accomplishment	{"id": 88, "role": "Curator"}	2024-07-26 23:05:22.754	59
457	5	discarded-accomplishment	{"id": 97, "role": "Curator"}	2024-07-26 23:05:22.754	59
458	5	discarded-accomplishment	{"id": 85, "role": "Curator"}	2024-07-26 23:05:22.754	59
459	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:22.754	59
460	5	discarded-accomplishment	{"id": 56, "role": "Entrepreneur"}	2024-07-26 23:05:22.754	59
461	5	discarded-accomplishment	{"id": 51, "role": "Entrepreneur"}	2024-07-26 23:05:22.754	59
462	5	discarded-accomplishment	{"id": 47, "role": "Entrepreneur"}	2024-07-26 23:05:22.754	59
463	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:22.754	59
464	5	discarded-accomplishment	{"id": 30, "role": "Pioneer"}	2024-07-26 23:05:22.754	59
465	5	discarded-accomplishment	{"id": 35, "role": "Pioneer"}	2024-07-26 23:05:22.754	59
466	5	discarded-accomplishment	{"id": 21, "role": "Pioneer"}	2024-07-26 23:05:22.754	59
467	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:22.754	59
468	5	discarded-accomplishment	{"id": 72, "role": "Politician"}	2024-07-26 23:05:22.754	59
469	5	discarded-accomplishment	{"id": 76, "role": "Politician"}	2024-07-26 23:05:22.754	59
470	5	discarded-accomplishment	{"id": 71, "role": "Politician"}	2024-07-26 23:05:22.754	59
471	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:22.754	59
472	5	discarded-accomplishment	{"id": 12, "role": "Researcher"}	2024-07-26 23:05:22.754	59
473	5	discarded-accomplishment	{"id": 9, "role": "Researcher"}	2024-07-26 23:05:22.754	59
474	5	discarded-accomplishment	{"id": 5, "role": "Researcher"}	2024-07-26 23:05:22.754	59
475	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:22.754	59
527	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:28.757	179
528	5	exited-trade-phase	{}	2024-07-26 23:05:28.757	179
529	5	entered-purchase-phase	{}	2024-07-26 23:05:28.757	179
530	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:29.772	59
531	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:29.772	59
532	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:29.772	59
533	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:29.772	59
534	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:29.772	59
535	5	exited-purchase-phase	{}	2024-07-26 23:05:29.772	59
536	5	entered-discard-phase	{}	2024-07-26 23:05:29.772	59
537	5	discarded-accomplishment	{"id": 87, "role": "Curator"}	2024-07-26 23:05:30.738	59
538	5	discarded-accomplishment	{"id": 96, "role": "Curator"}	2024-07-26 23:05:30.738	59
476	5	taken-round-snapshot	{"round": 3, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 6, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [95], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 6, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 6, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [15], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 4, "science": 0, "government": 0}, "timeBlocks": 3, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}}, "logsLength": 23, "marsEventIds": ["lifeAsUsual", "lifeAsUsual", "outOfCommissionEntrepreneur"], "systemHealth": 25, "messagesLength": 0, "marsEventsProcessed": 2}	2024-07-26 23:05:22.754	59
477	5	added-system-health-contributions	{}	2024-07-26 23:05:22.754	59
478	5	entered-new-round-phase	{}	2024-07-26 23:05:22.754	59
479	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:23.766	59
480	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:23.766	59
481	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:23.766	59
482	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:23.766	59
483	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:23.766	59
484	5	subtracted-system-health-wear-and-tear	{}	2024-07-26 23:05:23.766	59
485	5	entered-mars-event-phase	{}	2024-07-26 23:05:23.766	59
486	5	initialized-mars-event	{}	2024-07-26 23:05:23.766	59
487	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:24.774	14
488	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:24.774	14
489	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:24.774	14
490	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:24.774	14
491	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:24.774	14
492	5	finalized-mars-event	{}	2024-07-26 23:05:24.774	14
493	5	reentered-mars-event-phase	{}	2024-07-26 23:05:24.774	14
494	5	initialized-mars-event	{}	2024-07-26 23:05:24.774	14
495	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:25.732	9
496	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:25.732	9
497	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:25.732	9
498	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:25.732	9
499	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:25.732	9
500	5	finalized-mars-event	{}	2024-07-26 23:05:25.732	9
501	5	reentered-mars-event-phase	{}	2024-07-26 23:05:25.732	9
502	5	initialized-mars-event	{}	2024-07-26 23:05:25.732	9
503	5	voted-for-personal-gain	{"role": "Curator", "vote": false}	2024-07-26 23:05:26.756	89
504	5	voted-for-personal-gain	{"role": "Entrepreneur", "vote": false}	2024-07-26 23:05:26.756	89
505	5	voted-for-personal-gain	{"role": "Pioneer", "vote": false}	2024-07-26 23:05:26.756	89
506	5	voted-for-personal-gain	{"role": "Politician", "vote": false}	2024-07-26 23:05:26.756	89
507	5	voted-for-personal-gain	{"role": "Researcher", "vote": false}	2024-07-26 23:05:26.756	89
508	5	finalized-mars-event	{}	2024-07-26 23:05:26.756	89
509	5	exited-mars-event-phase	{}	2024-07-26 23:05:26.756	89
510	5	entered-investment-phase	{}	2024-07-26 23:05:26.756	89
511	5	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 3}}	2024-07-26 23:05:27.751	179
512	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:27.751	179
513	5	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 3}}	2024-07-26 23:05:27.751	179
514	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:27.751	179
515	5	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 3}}	2024-07-26 23:05:27.751	179
516	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:27.751	179
517	5	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 3}}	2024-07-26 23:05:27.751	179
518	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:27.751	179
519	5	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 3}}	2024-07-26 23:05:27.751	179
520	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:27.751	179
521	5	exited-investment-phase	{}	2024-07-26 23:05:27.751	179
522	5	entered-trade-phase	{}	2024-07-26 23:05:27.751	179
523	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:28.757	179
524	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:28.757	179
525	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:28.757	179
526	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:28.757	179
643	6	finalized-mars-event	{}	2024-07-31 01:03:29.723	14
539	5	discarded-accomplishment	{"id": 89, "role": "Curator"}	2024-07-26 23:05:30.738	59
540	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:30.738	59
541	5	discarded-accomplishment	{"id": 52, "role": "Entrepreneur"}	2024-07-26 23:05:30.738	59
542	5	discarded-accomplishment	{"id": 50, "role": "Entrepreneur"}	2024-07-26 23:05:30.738	59
543	5	discarded-accomplishment	{"id": 49, "role": "Entrepreneur"}	2024-07-26 23:05:30.738	59
544	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:30.738	59
545	5	discarded-accomplishment	{"id": 28, "role": "Pioneer"}	2024-07-26 23:05:30.738	59
546	5	discarded-accomplishment	{"id": 29, "role": "Pioneer"}	2024-07-26 23:05:30.738	59
547	5	discarded-accomplishment	{"id": 37, "role": "Pioneer"}	2024-07-26 23:05:30.738	59
548	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:30.738	59
549	5	discarded-accomplishment	{"id": 68, "role": "Politician"}	2024-07-26 23:05:30.738	59
550	5	discarded-accomplishment	{"id": 70, "role": "Politician"}	2024-07-26 23:05:30.738	59
551	5	discarded-accomplishment	{"id": 74, "role": "Politician"}	2024-07-26 23:05:30.738	59
552	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:30.738	59
553	5	discarded-accomplishment	{"id": 17, "role": "Researcher"}	2024-07-26 23:05:30.738	59
554	5	discarded-accomplishment	{"id": 7, "role": "Researcher"}	2024-07-26 23:05:30.738	59
555	5	discarded-accomplishment	{"id": 16, "role": "Researcher"}	2024-07-26 23:05:30.738	59
556	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:30.738	59
557	5	taken-round-snapshot	{"round": 4, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 8, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [95], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 8, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 4}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 8, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [15], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 6, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}}, "logsLength": 31, "marsEventIds": ["difficultConditions", "cropFailure", "personalGain"], "systemHealth": 7, "messagesLength": 0, "marsEventsProcessed": 2}	2024-07-26 23:05:30.738	59
558	5	added-system-health-contributions	{}	2024-07-26 23:05:30.738	59
559	5	entered-new-round-phase	{}	2024-07-26 23:05:30.738	59
560	5	set-player-readiness	{"role": "Curator", "value": true}	2024-07-26 23:05:31.76	59
561	5	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-26 23:05:31.76	59
562	5	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-26 23:05:31.76	59
563	5	set-player-readiness	{"role": "Politician", "value": true}	2024-07-26 23:05:31.76	59
564	5	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-26 23:05:31.76	59
565	5	subtracted-system-health-wear-and-tear	{}	2024-07-26 23:05:31.76	59
566	5	entered-mars-event-phase	{}	2024-07-26 23:05:31.76	59
567	5	initialized-mars-event	{}	2024-07-26 23:05:31.76	59
568	5	selected-influence	{"role": "Curator", "influence": "culture"}	2024-07-26 23:05:32.76	89
569	5	selected-influence	{"role": "Entrepreneur", "influence": "culture"}	2024-07-26 23:05:32.76	89
570	5	selected-influence	{"role": "Pioneer", "influence": "culture"}	2024-07-26 23:05:32.76	89
571	5	selected-influence	{"role": "Politician", "influence": "culture"}	2024-07-26 23:05:32.76	89
572	5	selected-influence	{"role": "Researcher", "influence": "culture"}	2024-07-26 23:05:32.76	89
573	5	entered-defeat-phase	{"Curator": 6, "Pioneer": 0, "Politician": 0, "Researcher": 6, "Entrepreneur": 0}	2024-07-26 23:05:32.76	89
574	5	entered-defeat-phase	{"Curator": 6, "Pioneer": 0, "Politician": 0, "Researcher": 6, "Entrepreneur": 0}	2024-07-26 23:05:33.729	9999
575	6	taken-state-snapshot	{"logs": [], "phase": 0, "round": 1, "players": {"Curator": {"role": "Curator", "costs": {"legacy": 3, "culture": 2, "finance": 3, "science": 1000, "government": 1000, "systemHealth": 1}, "isBot": false, "ready": false, "isMuted": false, "username": "NebularFalcon4036", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "culture", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Curator", "purchased": [], "remaining": [96, 95, 85, 88, 82, 89, 91, 81, 94, 92, 97], "purchasable": [90, 93, 87]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Pioneer": {"role": "Pioneer", "costs": {"legacy": 2, "culture": 3, "finance": 1000, "science": 3, "government": 1000, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "LunarBison2329", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "legacy", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Pioneer", "purchased": [], "remaining": [35, 27, 36, 30, 32, 29, 34, 21, 22, 31, 33], "purchasable": [37, 28, 25]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Politician": {"role": "Politician", "costs": {"legacy": 1000, "culture": 1000, "finance": 3, "science": 3, "government": 2, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "SolarCamel3847", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "government", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Politician", "purchased": [], "remaining": [61, 74, 67, 75, 73, 71, 72, 70, 68, 69, 77], "purchasable": [76, 62, 65]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Researcher": {"role": "Researcher", "costs": {"legacy": 3, "culture": 1000, "finance": 1000, "science": 2, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "AuroralCamel4881", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "science", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Researcher", "purchased": [], "remaining": [15, 17, 2, 9, 7, 11, 14, 16, 13, 1, 8], "purchasable": [12, 10, 5]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}, "Entrepreneur": {"role": "Entrepreneur", "costs": {"legacy": 1000, "culture": 3, "finance": 2, "science": 1000, "government": 3, "systemHealth": 1}, "isBot": true, "ready": false, "isMuted": false, "username": "MartianCamel3681", "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "specialty": "finance", "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"role": "Entrepreneur", "purchased": [], "remaining": [42, 56, 54, 55, 50, 51, 48, 47, 49, 41, 53], "purchasable": [45, 52, 57]}, "pendingInvestments": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 0}, "systemHealthChange": {"purchases": [], "investment": 0}}}, "winners": [], "maxRound": 10, "messages": [], "tradeSet": {}, "userRoles": {"LunarBison2329": "Pioneer", "SolarCamel3847": "Politician", "AuroralCamel4881": "Researcher", "MartianCamel3681": "Entrepreneur", "NebularFalcon4036": "Curator"}, "marsEvents": [], "heroOrPariah": "", "systemHealth": 100, "marsEventDeck": {"deck": [{"id": "outOfCommissionPioneer", "name": "Out of Commission", "effect": "The Pioneer receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "stymied", "name": "Stymied", "effect": "Players may not earn their specialty Influence this round.", "duration": 1, "flavorText": "\\"That's very nice that you have three PhD's. Now pick up this toothbrush and help with cleaning our solar panel cells.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "solarFlare", "name": "Solar Flare", "effect": "Destroy 5 System Health. Skip discussion and trading phases this turn. Players cannot chat or trade Influences.", "duration": 1, "flavorText": "Solar flares pose a far greater threat on Mars, where a thin atmosphere and non-existent magnetic field leaves settlers more vulnerable. ", "timeDuration": 10, "clientViewHandler": "DISABLE_CHAT"}, {"id": "effortsWasted", "name": "Efforts Wasted", "effect": "Each player must discard an Accomplishment that they have already purchased.", "duration": 1, "flavorText": "\\"All markets are volatile. The trick is learning how to ride the waves.\\" - The Entrepreneur", "clientViewHandler": "ACCOMPLISHMENT_SELECT_PURCHASED"}, {"id": "hullBreach", "name": "Hull Breach", "effect": "Destroy 7 System Health.", "duration": 1, "flavorText": "\\"Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same.\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionPolitician", "name": "Out of Commission", "effect": "The Politician receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "changingTides", "name": "Changing Tides", "effect": "Each player discards all of their available Accomplishments and draws 1 new Accomplishment. You will be able to discard this Accomplishment at the end of this round and draw up to three new Accomplishments at the start of the next round (if this is not the final round).", "duration": 1, "flavorText": "Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionResearcher", "name": "Out of Commission", "effect": "The Researcher receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "marketsClosed", "name": "Markets Closed", "effect": "Players may not trade Influences this round.", "duration": 1, "flavorText": "\\"Trust is difficult to build and easy to break. Yet without it, this community would fall apart.\\" - The Curator", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "sandstorm", "name": "Sandstorm", "effect": "For the next 3 rounds, destroy an additional 10 System Health at the start of the round.", "duration": 3, "flavorText": "Buckle in - things are about to get rough. And coarse. And irritating.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "heroOrPariah", "name": "Hero or Pariah", "effect": "CHOOSE ONE: Players must vote for 1 player to lose all Influence OR Players must vote for 1 player to gain 4 of their specialty Influence", "duration": 1, "flavorText": "In a community as small as Port of Mars, some individuals always stand out - for better or worse.", "clientViewHandler": "VOTE_FOR_PLAYER_HERO_PARIAH"}, {"id": "personalGain", "name": "Personal Gain", "effect": "Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 System Health.", "duration": 1, "flavorText": "It's easy to take risks when others are incurring the costs.", "clientViewHandler": "VOTE_YES_NO"}, {"id": "outOfCommissionCurator", "name": "Out of Commission", "effect": "The Curator receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "outOfCommissionEntrepreneur", "name": "Out of Commission", "effect": "The Entrepreneur receives only 3 Time Blocks this round.", "duration": 1, "flavorText": "The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "breakdownOfTrust", "name": "Breakdown of Trust", "effect": "Each player can choose to save up to 2 units of Influence that they already own. The rest will be lost.", "duration": 1, "flavorText": "Setbacks are inevitable, but no less painful each time.", "clientViewHandler": "INFLUENCES_SELECT"}, {"id": "murphysLaw", "name": "Murphy's Law", "effect": "Reveal 2 more events. They're both in effect.", "duration": 1, "flavorText": "Residents at Port of Mars know better than to ask, \\"what ELSE could go wrong?\\"", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "audit", "name": "Audit", "effect": "In this round, players will be able to view each other's accomplishments, inventories, resources and investment decisions.", "duration": 1, "flavorText": "\\"Of course we trust everyone to be truthful. But it doesn't hurt to check now and again.\\" - The Politician", "timeDuration": 10, "clientViewHandler": "AUDIT"}, {"id": "bondingThroughAdversity", "name": "Bonding Through Adversity", "effect": "Each player gains one unit of Influence of their choice.", "duration": 1, "flavorText": "Challenges brings communities together.", "clientViewHandler": "INFLUENCES_DRAW"}, {"id": "interdisciplinary", "name": "Interdisciplinary", "effect": "For this round, each player can spend 3 Time Blocks to earn an Influence in either of the 2 Influences they normally can't create.", "duration": 1, "flavorText": "\\"Everyone knows the saying, 'Jack of all trades, master of none.' Few remember the second part: 'still better than a master of one.'\\" - The Pioneer", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "lostTime", "name": "Lost Time", "effect": "Each player has 5 fewer Time Blocks to spend this round.", "duration": 1, "flavorText": "Time flies when you're trying to stay alive.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "cropFailure", "name": "Crop Failure", "effect": "Destroy 20 System Health.", "duration": 1, "flavorText": "\\"The good news is we're not eating any more potatoes this cycle! The bad news is we're not sure what we're eating.\\" - The Researcher", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}, {"id": "difficultConditions", "name": "Difficult Conditions", "effect": "System Health costs twice as many Time Blocks as usual this round.", "duration": 1, "flavorText": "When one component breaks, it puts a strain on the rest of the system. Small failures often snowball into critical ones.", "timeDuration": 15, "clientViewHandler": "NO_CHANGE"}, {"id": "compulsivePhilanthropy", "name": "Compulsive Philanthropy", "effect": "Players must vote for one player to put all their Time Blocks into System Health this round.", "duration": 1, "flavorText": "There's nothing quite like being volun-told for the greater good.", "clientViewHandler": "VOTE_FOR_PLAYER_SINGLE"}, {"id": "lifeAsUsual", "name": "Life as Usual", "effect": "No special effect", "duration": 1, "flavorText": "As the first human outpost on Mars, having a \\"usual\\" day is pretty unusual.", "timeDuration": 10, "clientViewHandler": "NO_CHANGE"}], "position": 0}, "timeRemaining": 60, "lastTimePolled": 1722387504674, "tradingEnabled": true, "roundIntroduction": {"completedTrades": [], "systemHealthMarsEvents": [], "accomplishmentPurchases": [], "systemHealthAtStartOfRound": 100, "systemHealthMaintenanceCost": -25, "systemHealthGroupContributions": {}}, "marsEventsProcessed": 0}	2024-07-31 00:58:24.705	60
576	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 00:58:25.725	59
577	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 00:58:25.725	59
578	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 00:58:25.725	59
579	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 00:58:25.725	59
580	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 00:59:24.703	0
581	6	entered-investment-phase	{}	2024-07-31 00:59:24.703	0
582	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 00:59:25.723	179
583	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 00:59:25.723	179
584	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 00:59:25.723	179
585	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 00:59:25.723	179
586	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-31 00:59:25.723	179
587	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 00:59:25.723	179
588	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-31 00:59:25.723	179
589	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 00:59:25.723	179
590	6	exited-investment-phase	{}	2024-07-31 01:02:24.682	0
591	6	entered-trade-phase	{}	2024-07-31 01:02:24.682	0
592	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:02:25.693	179
593	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:02:25.693	179
594	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:02:25.693	179
595	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:02:25.693	179
596	6	bot-control-taken	{"role": "Curator"}	2024-07-31 01:03:24.684	120
597	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:25.694	119
598	6	exited-trade-phase	{}	2024-07-31 01:03:25.694	119
599	6	entered-purchase-phase	{}	2024-07-31 01:03:25.694	119
600	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:26.676	59
601	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:26.676	59
602	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:26.676	59
603	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:26.676	59
604	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:26.676	59
605	6	exited-purchase-phase	{}	2024-07-31 01:03:26.676	59
606	6	entered-discard-phase	{}	2024-07-31 01:03:26.676	59
607	6	discarded-accomplishment	{"id": 90, "role": "Curator"}	2024-07-31 01:03:27.705	59
608	6	discarded-accomplishment	{"id": 93, "role": "Curator"}	2024-07-31 01:03:27.705	59
609	6	discarded-accomplishment	{"id": 87, "role": "Curator"}	2024-07-31 01:03:27.705	59
610	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:27.705	59
611	6	discarded-accomplishment	{"id": 45, "role": "Entrepreneur"}	2024-07-31 01:03:27.705	59
612	6	discarded-accomplishment	{"id": 52, "role": "Entrepreneur"}	2024-07-31 01:03:27.705	59
613	6	discarded-accomplishment	{"id": 57, "role": "Entrepreneur"}	2024-07-31 01:03:27.705	59
614	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:27.705	59
615	6	discarded-accomplishment	{"id": 37, "role": "Pioneer"}	2024-07-31 01:03:27.705	59
616	6	discarded-accomplishment	{"id": 28, "role": "Pioneer"}	2024-07-31 01:03:27.705	59
617	6	discarded-accomplishment	{"id": 25, "role": "Pioneer"}	2024-07-31 01:03:27.705	59
618	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:27.705	59
619	6	discarded-accomplishment	{"id": 76, "role": "Politician"}	2024-07-31 01:03:27.705	59
620	6	discarded-accomplishment	{"id": 62, "role": "Politician"}	2024-07-31 01:03:27.705	59
621	6	discarded-accomplishment	{"id": 65, "role": "Politician"}	2024-07-31 01:03:27.705	59
622	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:27.705	59
623	6	discarded-accomplishment	{"id": 12, "role": "Researcher"}	2024-07-31 01:03:27.705	59
624	6	discarded-accomplishment	{"id": 10, "role": "Researcher"}	2024-07-31 01:03:27.705	59
625	6	discarded-accomplishment	{"id": 5, "role": "Researcher"}	2024-07-31 01:03:27.705	59
626	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:27.705	59
627	6	taken-round-snapshot	{"round": 1, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}}, "logsLength": 1, "marsEventIds": [], "systemHealth": 75, "messagesLength": 0, "marsEventsProcessed": 0}	2024-07-31 01:03:27.705	59
628	6	added-system-health-contributions	{}	2024-07-31 01:03:27.705	59
629	6	entered-new-round-phase	{}	2024-07-31 01:03:27.705	59
630	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:28.707	59
631	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:28.707	59
632	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:28.707	59
633	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:28.707	59
634	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:28.707	59
635	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:03:28.707	59
636	6	entered-mars-event-phase	{}	2024-07-31 01:03:28.707	59
637	6	initialized-mars-event	{}	2024-07-31 01:03:28.707	59
638	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:29.723	14
639	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:29.723	14
640	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:29.723	14
641	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:29.723	14
642	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:29.723	14
645	6	entered-investment-phase	{}	2024-07-31 01:03:29.723	14
646	6	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:30.718	179
647	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:30.718	179
648	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:30.718	179
649	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:30.718	179
650	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 3}}	2024-07-31 01:03:30.718	179
651	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:30.718	179
652	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-31 01:03:30.718	179
653	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:30.718	179
654	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:30.718	179
655	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:30.718	179
656	6	exited-investment-phase	{}	2024-07-31 01:03:30.718	179
657	6	entered-trade-phase	{}	2024-07-31 01:03:30.718	179
658	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:31.682	179
659	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:31.682	179
660	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:31.682	179
661	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:31.682	179
662	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:31.682	179
663	6	exited-trade-phase	{}	2024-07-31 01:03:31.682	179
664	6	entered-purchase-phase	{}	2024-07-31 01:03:31.682	179
665	6	purchased-accomplishment	{"role": "Curator", "accomplishment": {"id": 95, "role": "Curator"}}	2024-07-31 01:03:32.706	59
666	6	purchased-accomplishment	{"role": "Entrepreneur", "accomplishment": {"id": 54, "role": "Entrepreneur"}}	2024-07-31 01:03:32.706	59
667	6	purchased-accomplishment	{"role": "Pioneer", "accomplishment": {"id": 35, "role": "Pioneer"}}	2024-07-31 01:03:32.706	59
668	6	purchased-accomplishment	{"role": "Politician", "accomplishment": {"id": 74, "role": "Politician"}}	2024-07-31 01:03:32.706	59
669	6	purchased-accomplishment	{"role": "Researcher", "accomplishment": {"id": 15, "role": "Researcher"}}	2024-07-31 01:03:32.706	59
670	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:33.716	58
671	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:33.716	58
672	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:33.716	58
673	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:33.716	58
674	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:33.716	58
675	6	exited-purchase-phase	{}	2024-07-31 01:03:33.716	58
676	6	entered-discard-phase	{}	2024-07-31 01:03:33.716	58
677	6	discarded-accomplishment	{"id": 96, "role": "Curator"}	2024-07-31 01:03:34.688	59
678	6	discarded-accomplishment	{"id": 85, "role": "Curator"}	2024-07-31 01:03:34.688	59
679	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:34.688	59
680	6	discarded-accomplishment	{"id": 42, "role": "Entrepreneur"}	2024-07-31 01:03:34.688	59
681	6	discarded-accomplishment	{"id": 56, "role": "Entrepreneur"}	2024-07-31 01:03:34.688	59
682	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:34.688	59
683	6	discarded-accomplishment	{"id": 27, "role": "Pioneer"}	2024-07-31 01:03:34.688	59
684	6	discarded-accomplishment	{"id": 36, "role": "Pioneer"}	2024-07-31 01:03:34.688	59
685	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:34.688	59
686	6	discarded-accomplishment	{"id": 61, "role": "Politician"}	2024-07-31 01:03:34.688	59
687	6	discarded-accomplishment	{"id": 67, "role": "Politician"}	2024-07-31 01:03:34.688	59
688	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:34.688	59
689	6	discarded-accomplishment	{"id": 17, "role": "Researcher"}	2024-07-31 01:03:34.688	59
690	6	discarded-accomplishment	{"id": 2, "role": "Researcher"}	2024-07-31 01:03:34.688	59
691	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:34.688	59
743	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:40.682	179
744	6	exited-trade-phase	{}	2024-07-31 01:03:40.682	179
745	6	entered-purchase-phase	{}	2024-07-31 01:03:40.682	179
746	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:41.698	59
747	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:41.698	59
748	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:41.698	59
749	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:41.698	59
750	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:41.698	59
751	6	exited-purchase-phase	{}	2024-07-31 01:03:41.698	59
752	6	entered-discard-phase	{}	2024-07-31 01:03:41.698	59
753	6	discarded-accomplishment	{"id": 88, "role": "Curator"}	2024-07-31 01:03:42.723	59
754	6	discarded-accomplishment	{"id": 82, "role": "Curator"}	2024-07-31 01:03:42.723	59
755	6	discarded-accomplishment	{"id": 89, "role": "Curator"}	2024-07-31 01:03:42.723	59
756	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:42.723	59
757	6	discarded-accomplishment	{"id": 55, "role": "Entrepreneur"}	2024-07-31 01:03:42.723	59
758	6	discarded-accomplishment	{"id": 50, "role": "Entrepreneur"}	2024-07-31 01:03:42.723	59
692	6	taken-round-snapshot	{"round": 2, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [95], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 3, "victoryPoints": 6, "accomplishment": {"purchased": [35], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 4}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [74], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 4, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [15], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 4, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [54], "purchasable": []}}}, "logsLength": 12, "marsEventIds": ["outOfCommissionPioneer"], "systemHealth": 74, "messagesLength": 0, "marsEventsProcessed": 0}	2024-07-31 01:03:34.688	59
693	6	added-system-health-contributions	{}	2024-07-31 01:03:34.688	59
694	6	entered-new-round-phase	{}	2024-07-31 01:03:34.688	59
695	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:35.696	59
696	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:35.696	59
697	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:35.696	59
698	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:35.696	59
699	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:35.696	59
700	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:03:35.696	59
701	6	entered-mars-event-phase	{}	2024-07-31 01:03:35.696	59
702	6	initialized-mars-event	{}	2024-07-31 01:03:35.696	59
703	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:36.71	9
704	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:36.71	9
705	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:36.71	9
706	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:36.71	9
707	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:36.71	9
708	6	finalized-mars-event	{}	2024-07-31 01:03:36.71	9
709	6	reentered-mars-event-phase	{}	2024-07-31 01:03:36.71	9
710	6	initialized-mars-event	{}	2024-07-31 01:03:36.71	9
711	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:37.723	9
712	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:37.723	9
713	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:37.723	9
714	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:37.723	9
715	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:37.723	9
716	6	finalized-mars-event	{}	2024-07-31 01:03:37.723	9
717	6	reentered-mars-event-phase	{}	2024-07-31 01:03:37.723	9
718	6	initialized-mars-event	{}	2024-07-31 01:03:37.723	9
719	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:38.69	9
720	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:38.69	9
721	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:38.69	9
722	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:38.69	9
723	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:38.69	9
724	6	finalized-mars-event	{}	2024-07-31 01:03:38.69	9
725	6	exited-mars-event-phase	{}	2024-07-31 01:03:38.69	9
726	6	entered-investment-phase	{}	2024-07-31 01:03:38.69	9
727	6	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:39.71	179
728	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:39.71	179
729	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:39.71	179
730	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:39.71	179
731	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:39.71	179
732	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:39.71	179
733	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-31 01:03:39.71	179
734	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:39.71	179
735	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:39.71	179
736	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:39.71	179
737	6	exited-investment-phase	{}	2024-07-31 01:03:39.71	179
738	6	entered-trade-phase	{}	2024-07-31 01:03:39.71	179
739	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:40.682	179
740	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:40.682	179
741	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:40.682	179
742	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:40.682	179
863	6	entered-mars-event-phase	{}	2024-07-31 01:03:51.709	59
759	6	discarded-accomplishment	{"id": 51, "role": "Entrepreneur"}	2024-07-31 01:03:42.723	59
760	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:42.723	59
761	6	discarded-accomplishment	{"id": 30, "role": "Pioneer"}	2024-07-31 01:03:42.723	59
762	6	discarded-accomplishment	{"id": 32, "role": "Pioneer"}	2024-07-31 01:03:42.723	59
763	6	discarded-accomplishment	{"id": 29, "role": "Pioneer"}	2024-07-31 01:03:42.723	59
764	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:42.723	59
765	6	discarded-accomplishment	{"id": 75, "role": "Politician"}	2024-07-31 01:03:42.723	59
766	6	discarded-accomplishment	{"id": 73, "role": "Politician"}	2024-07-31 01:03:42.723	59
767	6	discarded-accomplishment	{"id": 71, "role": "Politician"}	2024-07-31 01:03:42.723	59
768	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:42.723	59
769	6	discarded-accomplishment	{"id": 9, "role": "Researcher"}	2024-07-31 01:03:42.723	59
770	6	discarded-accomplishment	{"id": 7, "role": "Researcher"}	2024-07-31 01:03:42.723	59
771	6	discarded-accomplishment	{"id": 11, "role": "Researcher"}	2024-07-31 01:03:42.723	59
772	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:42.723	59
773	6	taken-round-snapshot	{"round": 3, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 4, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [95], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 4, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [35], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 6}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [74], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 6, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [15], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 6, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [54], "purchasable": []}}}, "logsLength": 21, "marsEventIds": ["lifeAsUsual", "lifeAsUsual", "lifeAsUsual"], "systemHealth": 25, "messagesLength": 0, "marsEventsProcessed": 2}	2024-07-31 01:03:42.723	59
774	6	added-system-health-contributions	{}	2024-07-31 01:03:42.723	59
775	6	entered-new-round-phase	{}	2024-07-31 01:03:42.723	59
776	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:43.695	59
777	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:43.695	59
778	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:43.695	59
779	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:43.695	59
780	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:43.695	59
781	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:03:43.695	59
782	6	entered-mars-event-phase	{}	2024-07-31 01:03:43.695	59
783	6	initialized-mars-event	{}	2024-07-31 01:03:43.695	59
784	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:44.727	9
785	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:44.727	9
786	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:44.727	9
787	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:44.727	9
788	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:44.727	9
789	6	finalized-mars-event	{}	2024-07-31 01:03:44.727	9
790	6	reentered-mars-event-phase	{}	2024-07-31 01:03:44.727	9
791	6	initialized-mars-event	{}	2024-07-31 01:03:44.727	9
792	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:45.695	9
793	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:45.695	9
794	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:45.695	9
795	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:45.695	9
796	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:45.695	9
797	6	finalized-mars-event	{}	2024-07-31 01:03:45.695	9
798	6	reentered-mars-event-phase	{}	2024-07-31 01:03:45.695	9
799	6	initialized-mars-event	{}	2024-07-31 01:03:45.695	9
800	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:46.71	9
801	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:46.71	9
802	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:46.71	9
803	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:46.71	9
804	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:46.71	9
805	6	finalized-mars-event	{}	2024-07-31 01:03:46.71	9
806	6	exited-mars-event-phase	{}	2024-07-31 01:03:46.71	9
807	6	entered-investment-phase	{}	2024-07-31 01:03:46.71	9
808	6	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 10}}	2024-07-31 01:03:47.686	179
809	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:47.686	179
810	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 10}}	2024-07-31 01:03:47.686	179
811	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:47.686	179
864	6	initialized-mars-event	{}	2024-07-31 01:03:51.709	59
812	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 10}}	2024-07-31 01:03:47.686	179
813	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:47.686	179
814	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 10}}	2024-07-31 01:03:47.686	179
815	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:47.686	179
816	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 10}}	2024-07-31 01:03:47.686	179
817	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:47.686	179
818	6	exited-investment-phase	{}	2024-07-31 01:03:47.686	179
819	6	entered-trade-phase	{}	2024-07-31 01:03:47.686	179
820	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:48.695	179
821	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:48.695	179
822	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:48.695	179
823	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:48.695	179
824	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:48.695	179
825	6	exited-trade-phase	{}	2024-07-31 01:03:48.695	179
826	6	entered-purchase-phase	{}	2024-07-31 01:03:48.695	179
827	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:49.726	59
828	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:49.726	59
829	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:49.726	59
830	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:49.726	59
831	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:49.726	59
832	6	exited-purchase-phase	{}	2024-07-31 01:03:49.726	59
833	6	entered-discard-phase	{}	2024-07-31 01:03:49.726	59
834	6	discarded-accomplishment	{"id": 91, "role": "Curator"}	2024-07-31 01:03:50.696	59
835	6	discarded-accomplishment	{"id": 81, "role": "Curator"}	2024-07-31 01:03:50.696	59
836	6	discarded-accomplishment	{"id": 94, "role": "Curator"}	2024-07-31 01:03:50.696	59
837	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:50.696	59
838	6	discarded-accomplishment	{"id": 48, "role": "Entrepreneur"}	2024-07-31 01:03:50.696	59
839	6	discarded-accomplishment	{"id": 47, "role": "Entrepreneur"}	2024-07-31 01:03:50.696	59
840	6	discarded-accomplishment	{"id": 49, "role": "Entrepreneur"}	2024-07-31 01:03:50.696	59
841	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:50.696	59
842	6	discarded-accomplishment	{"id": 34, "role": "Pioneer"}	2024-07-31 01:03:50.696	59
843	6	discarded-accomplishment	{"id": 21, "role": "Pioneer"}	2024-07-31 01:03:50.696	59
844	6	discarded-accomplishment	{"id": 22, "role": "Pioneer"}	2024-07-31 01:03:50.696	59
845	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:50.696	59
846	6	discarded-accomplishment	{"id": 72, "role": "Politician"}	2024-07-31 01:03:50.696	59
847	6	discarded-accomplishment	{"id": 70, "role": "Politician"}	2024-07-31 01:03:50.696	59
848	6	discarded-accomplishment	{"id": 68, "role": "Politician"}	2024-07-31 01:03:50.696	59
849	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:50.696	59
850	6	discarded-accomplishment	{"id": 14, "role": "Researcher"}	2024-07-31 01:03:50.696	59
851	6	discarded-accomplishment	{"id": 16, "role": "Researcher"}	2024-07-31 01:03:50.696	59
852	6	discarded-accomplishment	{"id": 13, "role": "Researcher"}	2024-07-31 01:03:50.696	59
853	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:50.696	59
854	6	taken-round-snapshot	{"round": 4, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 4, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [95], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 4, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [35], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 6}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [74], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 6, "government": 0}, "timeBlocks": 10, "victoryPoints": 6, "accomplishment": {"purchased": [15], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 6, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [54], "purchasable": []}}}, "logsLength": 29, "marsEventIds": ["lifeAsUsual", "stymied", "lifeAsUsual"], "systemHealth": 30, "messagesLength": 0, "marsEventsProcessed": 2}	2024-07-31 01:03:50.696	59
855	6	added-system-health-contributions	{}	2024-07-31 01:03:50.696	59
856	6	entered-new-round-phase	{}	2024-07-31 01:03:50.696	59
857	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:51.709	59
858	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:51.709	59
859	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:51.709	59
860	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:51.709	59
861	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:51.709	59
862	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:03:51.709	59
865	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:52.723	9
866	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:52.723	9
867	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:52.723	9
868	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:52.723	9
869	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:52.723	9
870	6	finalized-mars-event	{}	2024-07-31 01:03:52.723	9
871	6	reentered-mars-event-phase	{}	2024-07-31 01:03:52.723	9
872	6	initialized-mars-event	{}	2024-07-31 01:03:52.723	9
873	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:53.687	89
874	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:53.687	89
875	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:53.687	89
876	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:53.687	89
877	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:53.687	89
878	6	finalized-mars-event	{}	2024-07-31 01:03:53.687	89
879	6	exited-mars-event-phase	{}	2024-07-31 01:03:53.687	89
880	6	entered-investment-phase	{}	2024-07-31 01:03:53.687	89
881	6	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:54.71	179
882	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:54.71	179
883	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:54.71	179
884	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:54.71	179
885	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:54.71	179
886	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:54.71	179
887	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-31 01:03:54.71	179
888	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:54.71	179
889	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-31 01:03:54.71	179
890	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:54.71	179
891	6	exited-investment-phase	{}	2024-07-31 01:03:54.71	179
892	6	entered-purchase-phase	{}	2024-07-31 01:03:54.71	179
893	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:55.691	59
894	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:55.691	59
895	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:55.691	59
896	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:55.691	59
897	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:55.691	59
898	6	exited-purchase-phase	{}	2024-07-31 01:03:55.691	59
899	6	entered-discard-phase	{}	2024-07-31 01:03:55.691	59
900	6	discarded-accomplishment	{"id": 92, "role": "Curator"}	2024-07-31 01:03:56.719	59
901	6	discarded-accomplishment	{"id": 97, "role": "Curator"}	2024-07-31 01:03:56.719	59
902	6	discarded-accomplishment	{"id": 90, "role": "Curator"}	2024-07-31 01:03:56.719	59
903	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:56.719	59
904	6	discarded-accomplishment	{"id": 41, "role": "Entrepreneur"}	2024-07-31 01:03:56.719	59
905	6	discarded-accomplishment	{"id": 53, "role": "Entrepreneur"}	2024-07-31 01:03:56.719	59
906	6	discarded-accomplishment	{"id": 45, "role": "Entrepreneur"}	2024-07-31 01:03:56.719	59
907	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:56.719	59
908	6	discarded-accomplishment	{"id": 31, "role": "Pioneer"}	2024-07-31 01:03:56.719	59
909	6	discarded-accomplishment	{"id": 33, "role": "Pioneer"}	2024-07-31 01:03:56.719	59
910	6	discarded-accomplishment	{"id": 37, "role": "Pioneer"}	2024-07-31 01:03:56.719	59
911	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:56.719	59
912	6	discarded-accomplishment	{"id": 69, "role": "Politician"}	2024-07-31 01:03:56.719	59
913	6	discarded-accomplishment	{"id": 77, "role": "Politician"}	2024-07-31 01:03:56.719	59
914	6	discarded-accomplishment	{"id": 76, "role": "Politician"}	2024-07-31 01:03:56.719	59
915	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:56.719	59
916	6	discarded-accomplishment	{"id": 1, "role": "Researcher"}	2024-07-31 01:03:56.719	59
917	6	discarded-accomplishment	{"id": 8, "role": "Researcher"}	2024-07-31 01:03:56.719	59
918	6	discarded-accomplishment	{"id": 12, "role": "Researcher"}	2024-07-31 01:03:56.719	59
919	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:56.719	59
972	6	entered-discard-phase	{}	2024-07-31 01:04:02.703	59
973	6	discarded-accomplishment	{"id": 93, "role": "Curator"}	2024-07-31 01:04:03.727	59
974	6	discarded-accomplishment	{"id": 87, "role": "Curator"}	2024-07-31 01:04:03.727	59
975	6	discarded-accomplishment	{"id": 96, "role": "Curator"}	2024-07-31 01:04:03.727	59
976	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:03.727	59
977	6	discarded-accomplishment	{"id": 52, "role": "Entrepreneur"}	2024-07-31 01:04:03.727	59
978	6	discarded-accomplishment	{"id": 57, "role": "Entrepreneur"}	2024-07-31 01:04:03.727	59
979	6	discarded-accomplishment	{"id": 42, "role": "Entrepreneur"}	2024-07-31 01:04:03.727	59
980	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:03.727	59
1031	6	entered-trade-phase	{}	2024-07-31 01:04:07.71	179
920	6	taken-round-snapshot	{"round": 5, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 6, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 6, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 8}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 8, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 8, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}}, "logsLength": 36, "marsEventIds": ["solarFlare", "effortsWasted"], "systemHealth": 50, "messagesLength": 0, "marsEventsProcessed": 1}	2024-07-31 01:03:56.719	59
921	6	added-system-health-contributions	{}	2024-07-31 01:03:56.719	59
922	6	entered-new-round-phase	{}	2024-07-31 01:03:56.719	59
923	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:57.683	59
924	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:57.683	59
925	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:57.683	59
926	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:57.683	59
927	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:57.683	59
928	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:03:57.683	59
929	6	entered-mars-event-phase	{}	2024-07-31 01:03:57.683	59
930	6	initialized-mars-event	{}	2024-07-31 01:03:57.683	59
931	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:58.697	9
932	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:58.697	9
933	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:58.697	9
934	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:58.697	9
935	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:58.697	9
936	6	finalized-mars-event	{}	2024-07-31 01:03:58.697	9
937	6	reentered-mars-event-phase	{}	2024-07-31 01:03:58.697	9
938	6	initialized-mars-event	{}	2024-07-31 01:03:58.697	9
939	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:03:59.713	9
940	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:03:59.713	9
941	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:03:59.713	9
942	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:03:59.713	9
943	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:03:59.713	9
944	6	finalized-mars-event	{}	2024-07-31 01:03:59.713	9
945	6	exited-mars-event-phase	{}	2024-07-31 01:03:59.713	9
946	6	entered-investment-phase	{}	2024-07-31 01:03:59.713	9
947	6	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:00.722	179
948	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:00.722	179
949	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:00.722	179
950	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:00.722	179
951	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:00.722	179
952	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:00.722	179
953	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-31 01:04:00.722	179
954	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:00.722	179
955	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:00.722	179
956	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:00.722	179
957	6	exited-investment-phase	{}	2024-07-31 01:04:00.722	179
958	6	entered-trade-phase	{}	2024-07-31 01:04:00.722	179
959	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:01.677	179
960	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:01.677	179
961	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:01.677	179
962	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:01.677	179
963	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:01.677	179
964	6	exited-trade-phase	{}	2024-07-31 01:04:01.677	179
965	6	entered-purchase-phase	{}	2024-07-31 01:04:01.677	179
966	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:02.703	59
967	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:02.703	59
968	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:02.703	59
969	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:02.703	59
970	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:02.703	59
971	6	exited-purchase-phase	{}	2024-07-31 01:04:02.703	59
981	6	discarded-accomplishment	{"id": 28, "role": "Pioneer"}	2024-07-31 01:04:03.727	59
982	6	discarded-accomplishment	{"id": 25, "role": "Pioneer"}	2024-07-31 01:04:03.727	59
983	6	discarded-accomplishment	{"id": 27, "role": "Pioneer"}	2024-07-31 01:04:03.727	59
984	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:03.727	59
985	6	discarded-accomplishment	{"id": 62, "role": "Politician"}	2024-07-31 01:04:03.727	59
986	6	discarded-accomplishment	{"id": 65, "role": "Politician"}	2024-07-31 01:04:03.727	59
987	6	discarded-accomplishment	{"id": 61, "role": "Politician"}	2024-07-31 01:04:03.727	59
988	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:03.727	59
989	6	discarded-accomplishment	{"id": 10, "role": "Researcher"}	2024-07-31 01:04:03.727	59
990	6	discarded-accomplishment	{"id": 5, "role": "Researcher"}	2024-07-31 01:04:03.727	59
991	6	discarded-accomplishment	{"id": 17, "role": "Researcher"}	2024-07-31 01:04:03.727	59
992	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:03.727	59
993	6	taken-round-snapshot	{"round": 6, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 8, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 8, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 10}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 10, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 10, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}}, "logsLength": 43, "marsEventIds": ["hullBreach", "lifeAsUsual"], "systemHealth": 48, "messagesLength": 0, "marsEventsProcessed": 1}	2024-07-31 01:04:03.727	59
994	6	added-system-health-contributions	{}	2024-07-31 01:04:03.727	59
995	6	entered-new-round-phase	{}	2024-07-31 01:04:03.727	59
996	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:04.708	59
997	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:04.708	59
998	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:04.708	59
999	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:04.708	59
1000	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:04.708	59
1001	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:04:04.708	59
1002	6	entered-mars-event-phase	{}	2024-07-31 01:04:04.708	59
1003	6	initialized-mars-event	{}	2024-07-31 01:04:04.708	59
1004	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:05.718	14
1005	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:05.718	14
1006	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:05.718	14
1007	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:05.718	14
1008	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:05.718	14
1009	6	finalized-mars-event	{}	2024-07-31 01:04:05.718	14
1010	6	reentered-mars-event-phase	{}	2024-07-31 01:04:05.718	14
1011	6	initialized-mars-event	{}	2024-07-31 01:04:05.718	14
1012	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:06.677	9
1013	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:06.677	9
1014	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:06.677	9
1015	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:06.677	9
1016	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:06.677	9
1017	6	finalized-mars-event	{}	2024-07-31 01:04:06.677	9
1018	6	exited-mars-event-phase	{}	2024-07-31 01:04:06.677	9
1019	6	entered-investment-phase	{}	2024-07-31 01:04:06.677	9
1020	6	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:07.71	179
1021	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:07.71	179
1022	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:07.71	179
1023	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:07.71	179
1024	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:07.71	179
1025	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:07.71	179
1026	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 3}}	2024-07-31 01:04:07.71	179
1027	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:07.71	179
1028	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:07.71	179
1029	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:07.71	179
1030	6	exited-investment-phase	{}	2024-07-31 01:04:07.71	179
1032	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:08.685	179
1033	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:08.685	179
1034	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:08.685	179
1035	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:08.685	179
1036	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:08.685	179
1037	6	exited-trade-phase	{}	2024-07-31 01:04:08.685	179
1038	6	entered-purchase-phase	{}	2024-07-31 01:04:08.685	179
1039	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:09.693	59
1040	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:09.693	59
1041	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:09.693	59
1042	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:09.693	59
1043	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:09.693	59
1044	6	exited-purchase-phase	{}	2024-07-31 01:04:09.693	59
1045	6	entered-discard-phase	{}	2024-07-31 01:04:09.693	59
1046	6	discarded-accomplishment	{"id": 89, "role": "Curator"}	2024-07-31 01:04:10.703	59
1047	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:10.703	59
1048	6	discarded-accomplishment	{"id": 51, "role": "Entrepreneur"}	2024-07-31 01:04:10.703	59
1049	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:10.703	59
1050	6	discarded-accomplishment	{"id": 29, "role": "Pioneer"}	2024-07-31 01:04:10.703	59
1051	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:10.703	59
1052	6	discarded-accomplishment	{"id": 71, "role": "Politician"}	2024-07-31 01:04:10.703	59
1053	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:10.703	59
1054	6	discarded-accomplishment	{"id": 11, "role": "Researcher"}	2024-07-31 01:04:10.703	59
1055	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:10.703	59
1056	6	taken-round-snapshot	{"round": 7, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 10, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 10, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 10}, "timeBlocks": 3, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 12, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 12, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}}, "logsLength": 50, "marsEventIds": ["outOfCommissionPolitician", "changingTides"], "systemHealth": 53, "messagesLength": 0, "marsEventsProcessed": 1}	2024-07-31 01:04:10.703	59
1057	6	added-system-health-contributions	{}	2024-07-31 01:04:10.703	59
1058	6	entered-new-round-phase	{}	2024-07-31 01:04:10.703	59
1059	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:11.711	59
1060	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:11.711	59
1061	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:11.711	59
1062	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:11.711	59
1063	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:11.711	59
1064	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:04:11.711	59
1065	6	entered-mars-event-phase	{}	2024-07-31 01:04:11.711	59
1066	6	initialized-mars-event	{}	2024-07-31 01:04:11.711	59
1067	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:12.684	9
1068	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:12.684	9
1069	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:12.684	9
1070	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:12.684	9
1071	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:12.684	9
1072	6	finalized-mars-event	{}	2024-07-31 01:04:12.684	9
1073	6	reentered-mars-event-phase	{}	2024-07-31 01:04:12.684	9
1074	6	initialized-mars-event	{}	2024-07-31 01:04:12.684	9
1075	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:13.722	9
1076	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:13.722	9
1077	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:13.722	9
1078	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:13.722	9
1079	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:13.722	9
1080	6	finalized-mars-event	{}	2024-07-31 01:04:13.722	9
1081	6	exited-mars-event-phase	{}	2024-07-31 01:04:13.722	9
1082	6	entered-investment-phase	{}	2024-07-31 01:04:13.722	9
1083	6	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:14.695	179
1084	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:14.695	179
1085	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:14.695	179
1086	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:14.695	179
1087	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:14.695	179
1088	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:14.695	179
1089	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-31 01:04:14.695	179
1090	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:14.695	179
1091	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 2, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:14.695	179
1092	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:14.695	179
1093	6	exited-investment-phase	{}	2024-07-31 01:04:14.695	179
1094	6	entered-trade-phase	{}	2024-07-31 01:04:14.695	179
1095	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:15.723	179
1096	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:15.723	179
1097	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:15.723	179
1098	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:15.723	179
1099	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:15.723	179
1100	6	exited-trade-phase	{}	2024-07-31 01:04:15.723	179
1101	6	entered-purchase-phase	{}	2024-07-31 01:04:15.723	179
1102	6	purchased-accomplishment	{"role": "Curator", "accomplishment": {"id": 94, "role": "Curator"}}	2024-07-31 01:04:16.688	59
1103	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:16.688	59
1104	6	purchased-accomplishment	{"role": "Pioneer", "accomplishment": {"id": 34, "role": "Pioneer"}}	2024-07-31 01:04:16.688	59
1105	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:16.688	59
1106	6	purchased-accomplishment	{"role": "Researcher", "accomplishment": {"id": 14, "role": "Researcher"}}	2024-07-31 01:04:16.688	59
1107	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:17.713	58
1108	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:17.713	58
1109	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:17.713	58
1110	6	exited-purchase-phase	{}	2024-07-31 01:04:17.713	58
1111	6	entered-discard-phase	{}	2024-07-31 01:04:17.713	58
1112	6	discarded-accomplishment	{"id": 91, "role": "Curator"}	2024-07-31 01:04:18.715	59
1113	6	discarded-accomplishment	{"id": 81, "role": "Curator"}	2024-07-31 01:04:18.715	59
1114	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:18.715	59
1115	6	discarded-accomplishment	{"id": 48, "role": "Entrepreneur"}	2024-07-31 01:04:18.715	59
1116	6	discarded-accomplishment	{"id": 47, "role": "Entrepreneur"}	2024-07-31 01:04:18.715	59
1117	6	discarded-accomplishment	{"id": 49, "role": "Entrepreneur"}	2024-07-31 01:04:18.715	59
1118	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:18.715	59
1119	6	discarded-accomplishment	{"id": 21, "role": "Pioneer"}	2024-07-31 01:04:18.715	59
1120	6	discarded-accomplishment	{"id": 22, "role": "Pioneer"}	2024-07-31 01:04:18.715	59
1121	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:18.715	59
1122	6	discarded-accomplishment	{"id": 72, "role": "Politician"}	2024-07-31 01:04:18.715	59
1123	6	discarded-accomplishment	{"id": 70, "role": "Politician"}	2024-07-31 01:04:18.715	59
1124	6	discarded-accomplishment	{"id": 68, "role": "Politician"}	2024-07-31 01:04:18.715	59
1125	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:18.715	59
1126	6	discarded-accomplishment	{"id": 16, "role": "Researcher"}	2024-07-31 01:04:18.715	59
1127	6	discarded-accomplishment	{"id": 13, "role": "Researcher"}	2024-07-31 01:04:18.715	59
1128	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:18.715	59
1129	6	taken-round-snapshot	{"round": 8, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 12, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [94], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 12, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [34], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 12}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 14, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [14], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 14, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 0, "accomplishment": {"purchased": [], "purchasable": []}}}, "logsLength": 60, "marsEventIds": ["lifeAsUsual", "lifeAsUsual"], "systemHealth": 55, "messagesLength": 0, "marsEventsProcessed": 1}	2024-07-31 01:04:18.715	59
1130	6	added-system-health-contributions	{}	2024-07-31 01:04:18.715	59
1131	6	entered-new-round-phase	{}	2024-07-31 01:04:18.715	59
1132	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:19.694	59
1133	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:19.694	59
1134	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:19.694	59
1135	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:19.694	59
1136	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:19.694	59
1137	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:04:19.694	59
1138	6	entered-mars-event-phase	{}	2024-07-31 01:04:19.694	59
1139	6	initialized-mars-event	{}	2024-07-31 01:04:19.694	59
1140	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:20.716	14
1141	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:20.716	14
1142	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:20.716	14
1143	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:20.716	14
1144	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:20.716	14
1145	6	finalized-mars-event	{}	2024-07-31 01:04:20.716	14
1146	6	reentered-mars-event-phase	{}	2024-07-31 01:04:20.716	14
1147	6	initialized-mars-event	{}	2024-07-31 01:04:20.716	14
1148	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:21.701	9
1149	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:21.701	9
1150	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:21.701	9
1151	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:21.701	9
1152	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:21.701	9
1153	6	finalized-mars-event	{}	2024-07-31 01:04:21.701	9
1154	6	exited-mars-event-phase	{}	2024-07-31 01:04:21.701	9
1155	6	entered-investment-phase	{}	2024-07-31 01:04:21.701	9
1156	6	time-invested	{"role": "Curator", "investment": {"legacy": 0, "culture": 2, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:22.717	179
1157	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:22.717	179
1158	6	time-invested	{"role": "Entrepreneur", "investment": {"legacy": 0, "culture": 0, "finance": 2, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:22.717	179
1159	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:22.717	179
1160	6	time-invested	{"role": "Pioneer", "investment": {"legacy": 2, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 6}}	2024-07-31 01:04:22.717	179
1161	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:22.717	179
1162	6	time-invested	{"role": "Politician", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 2, "systemHealth": 6}}	2024-07-31 01:04:22.717	179
1163	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:22.717	179
1164	6	time-invested	{"role": "Researcher", "investment": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 0, "systemHealth": 3}}	2024-07-31 01:04:22.717	179
1165	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:22.717	179
1166	6	exited-investment-phase	{}	2024-07-31 01:04:22.717	179
1167	6	entered-trade-phase	{}	2024-07-31 01:04:22.717	179
1168	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:23.707	179
1169	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:23.707	179
1170	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:23.707	179
1171	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:23.707	179
1172	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:23.707	179
1173	6	exited-trade-phase	{}	2024-07-31 01:04:23.707	179
1174	6	entered-purchase-phase	{}	2024-07-31 01:04:23.707	179
1175	6	purchased-accomplishment	{"role": "Curator", "accomplishment": {"id": 95, "role": "Curator"}}	2024-07-31 01:04:24.724	59
1176	6	purchased-accomplishment	{"role": "Entrepreneur", "accomplishment": {"id": 54, "role": "Entrepreneur"}}	2024-07-31 01:04:24.724	59
1177	6	purchased-accomplishment	{"role": "Pioneer", "accomplishment": {"id": 35, "role": "Pioneer"}}	2024-07-31 01:04:24.724	59
1178	6	purchased-accomplishment	{"role": "Politician", "accomplishment": {"id": 74, "role": "Politician"}}	2024-07-31 01:04:24.724	59
1179	6	purchased-accomplishment	{"role": "Researcher", "accomplishment": {"id": 15, "role": "Researcher"}}	2024-07-31 01:04:24.724	59
1180	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:25.689	58
1181	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:25.689	58
1182	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:25.689	58
1183	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:25.689	58
1184	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:25.689	58
1185	6	exited-purchase-phase	{}	2024-07-31 01:04:25.689	58
1186	6	entered-discard-phase	{}	2024-07-31 01:04:25.689	58
1187	6	discarded-accomplishment	{"id": 92, "role": "Curator"}	2024-07-31 01:04:26.695	59
1188	6	discarded-accomplishment	{"id": 97, "role": "Curator"}	2024-07-31 01:04:26.695	59
1189	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:26.695	59
1190	6	discarded-accomplishment	{"id": 41, "role": "Entrepreneur"}	2024-07-31 01:04:26.695	59
1191	6	discarded-accomplishment	{"id": 53, "role": "Entrepreneur"}	2024-07-31 01:04:26.695	59
1192	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:26.695	59
1193	6	discarded-accomplishment	{"id": 31, "role": "Pioneer"}	2024-07-31 01:04:26.695	59
1194	6	discarded-accomplishment	{"id": 33, "role": "Pioneer"}	2024-07-31 01:04:26.695	59
1195	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:26.695	59
1196	6	discarded-accomplishment	{"id": 69, "role": "Politician"}	2024-07-31 01:04:26.695	59
1197	6	discarded-accomplishment	{"id": 77, "role": "Politician"}	2024-07-31 01:04:26.695	59
1198	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:26.695	59
1199	6	discarded-accomplishment	{"id": 1, "role": "Researcher"}	2024-07-31 01:04:26.695	59
1200	6	discarded-accomplishment	{"id": 8, "role": "Researcher"}	2024-07-31 01:04:26.695	59
1201	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:26.695	59
1202	6	taken-round-snapshot	{"round": 9, "players": {"Curator": {"role": "Curator", "ready": true, "inventory": {"legacy": 0, "culture": 14, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 9, "accomplishment": {"purchased": [94, 95], "purchasable": []}}, "Pioneer": {"role": "Pioneer", "ready": true, "inventory": {"legacy": 14, "culture": 0, "finance": 0, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 9, "accomplishment": {"purchased": [34, 35], "purchasable": []}}, "Politician": {"role": "Politician", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 0, "government": 14}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [74], "purchasable": []}}, "Researcher": {"role": "Researcher", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 0, "science": 14, "government": 0}, "timeBlocks": 3, "victoryPoints": 9, "accomplishment": {"purchased": [14, 15], "purchasable": []}}, "Entrepreneur": {"role": "Entrepreneur", "ready": true, "inventory": {"legacy": 0, "culture": 0, "finance": 16, "science": 0, "government": 0}, "timeBlocks": 10, "victoryPoints": 3, "accomplishment": {"purchased": [54], "purchasable": []}}}, "logsLength": 73, "marsEventIds": ["outOfCommissionResearcher", "lifeAsUsual"], "systemHealth": 42, "messagesLength": 0, "marsEventsProcessed": 1}	2024-07-31 01:04:26.695	59
1203	6	added-system-health-contributions	{}	2024-07-31 01:04:26.695	59
1204	6	entered-new-round-phase	{}	2024-07-31 01:04:26.695	59
1205	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:27.725	59
1206	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:27.725	59
1207	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:27.725	59
1208	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:27.725	59
1209	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:27.725	59
1210	6	subtracted-system-health-wear-and-tear	{}	2024-07-31 01:04:27.725	59
1211	6	entered-mars-event-phase	{}	2024-07-31 01:04:27.725	59
1212	6	initialized-mars-event	{}	2024-07-31 01:04:27.725	59
1213	6	set-player-readiness	{"role": "Curator", "value": true}	2024-07-31 01:04:28.714	9
1214	6	set-player-readiness	{"role": "Entrepreneur", "value": true}	2024-07-31 01:04:28.714	9
1215	6	set-player-readiness	{"role": "Pioneer", "value": true}	2024-07-31 01:04:28.714	9
1216	6	set-player-readiness	{"role": "Politician", "value": true}	2024-07-31 01:04:28.714	9
1217	6	set-player-readiness	{"role": "Researcher", "value": true}	2024-07-31 01:04:28.714	9
1218	6	entered-defeat-phase	{"Curator": 9, "Pioneer": 9, "Politician": 3, "Researcher": 9, "Entrepreneur": 3}	2024-07-31 01:04:28.714	9
1219	6	entered-defeat-phase	{"Curator": 9, "Pioneer": 9, "Politician": 3, "Researcher": 9, "Entrepreneur": 3}	2024-07-31 01:04:29.691	9999
\.


--
-- Data for Name: lobby_chat_message; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.lobby_chat_message (id, "dateCreated", "userId", message, "roomId", "lobbyType") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1600968396723	Initial1600968396723
2	1607117297405	UserMetadataAddition1607117297405
3	1613509726805	AddUserIsBot1613509726805
4	1644350406427	addChampionshipRound1644350406427
5	1644363701712	addTournamentMetadata1644363701712
6	1657582808514	AddUserIsAdmin1657582808514
7	1666217996704	AddScheduledGameDate1666217996704
8	1666903440370	AddPassportIdToUser1666903440370
9	1667243476058	AddPlayerIp1667243476058
10	1667244753829	AddUserMetadata1667244753829
11	1669846502424	AddChatReporting1669846502424
12	1670531425797	RemoveUserIsBot1670531425797
13	1670976633211	ChangeLobbyCloseToGenerated1670976633211
14	1671156473904	AddModerationActionTable1671156473904
15	1677861842128	DropScheduledGameDate1677861842128
16	1687396740108	AddSoloGameData1687396740108
17	1693510548181	StoreSoloGameThresholds1693510548181
18	1693945293530	AddSoloGameMaxRound1693945293530
19	1696275612911	AddSoloHighScore1696275612911
20	1698183026092	AddGameType1698183026092
21	1698283007653	ChangeFreePlayTournamentName1698283007653
22	1698896130565	AddTreatments1698896130565
23	1699482607231	AddLobbyChatMessage1699482607231
24	1701799216158	AddGameRoundsRelationship1701799216158
25	1701805620516	ComputeSoloRoundInitialValues1701805620516
26	1706569597345	AddEducationModels1706569597345
27	1712620270893	AddTeacherPassword1712620270893
28	1713217959623	AddStudentPassword1713217959623
30	1705517898533	AddTournamentRoundSignups1705517898533
31	1715639656593	MakeStudentCodeClassroomCodeUnique1715639656593
33	1719960742206	AddGameClassroomId1719960742206
\.


--
-- Data for Name: moderation_action; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.moderation_action (id, "reportId", "userId", "adminId", action, "dateCreated", "daysMuted", revoked) FROM stdin;
\.


--
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.player (id, role, "userId", "gameId", points, "playerIp") FROM stdin;
1	Politician	119	1	0	
2	Curator	120	1	0	
3	Researcher	121	1	0	
4	Pioneer	122	1	0	
5	Entrepreneur	123	1	0	
6	Curator	120	2	\N	
7	Pioneer	121	2	\N	
8	Entrepreneur	122	2	\N	
9	Researcher	123	2	\N	
10	Politician	124	2	\N	
11	Entrepreneur	120	3	0	
12	Curator	121	3	0	
13	Researcher	122	3	0	
14	Pioneer	123	3	0	
15	Politician	125	3	0	
16	Pioneer	120	4	0	
17	Researcher	121	4	0	
18	Politician	122	4	0	
19	Curator	123	4	0	
20	Entrepreneur	126	4	0	
21	Curator	120	5	6	
22	Pioneer	121	5	0	
23	Entrepreneur	122	5	0	
24	Researcher	123	5	6	
25	Politician	128	5	0	
26	Entrepreneur	120	6	3	
27	Pioneer	121	6	9	
28	Politician	122	6	3	
29	Researcher	123	6	9	
30	Curator	145	6	9	
\.


--
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.question (id, "quizId", question, options, "correctAnswer", "tutorialElementId", "order") FROM stdin;
\.


--
-- Data for Name: question_response; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.question_response (id, "questionId", "submissionId", answer, "dateCreated") FROM stdin;
\.


--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.quiz (id, name) FROM stdin;
\.


--
-- Data for Name: quiz_submission; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.quiz_submission (id, "userId", "dateCreated", "quizId") FROM stdin;
\.


--
-- Data for Name: solo_game; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_game (id, "dateCreated", "playerId", "treatmentId", "deckId", status, "twoEventsThreshold", "threeEventsThreshold", "maxRound") FROM stdin;
\.


--
-- Data for Name: solo_game_round; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_game_round (id, "dateCreated", "gameId", "roundNumber", "decisionId", "initialSystemHealth", "initialPoints") FROM stdin;
\.


--
-- Data for Name: solo_game_treatment; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_game_treatment (id, "isNumberOfRoundsKnown", "isEventDeckKnown", "thresholdInformation") FROM stdin;
1	f	f	unknown
2	f	f	range
3	f	f	known
4	f	t	unknown
5	f	t	range
6	f	t	known
7	t	f	unknown
8	t	f	range
9	t	f	known
10	t	t	unknown
11	t	t	range
12	t	t	known
\.


--
-- Data for Name: solo_high_score; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_high_score (id, "userId", "pointsPerRound", points, "maxRound", "gameId", "dateCreated", "lastModified") FROM stdin;
\.


--
-- Data for Name: solo_mars_event_card; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_mars_event_card (id, "codeName", "displayName", "flavorText", effect, "drawMin", "drawMax", "rollMin", "rollMax", "systemHealthMultiplier", "pointsMultiplier", "resourcesMultiplier") FROM stdin;
1	lifeAsUsual	Life As Usual	As the first human outpost on Mars, having a "usual" day is pretty unusual.	No special effect.	10	20	0	0	0	0	0
2	murphysLaw	Murphy's Law	Residents at Port of Mars know better than to ask, "what ELSE could go wrong?"	Reveal 2 more events for this round.	1	1	0	0	0	0	0
3	lostTime	Lost Time	Time flies when you're trying to stay alive.	Lose {roll} resource{s} for this round.	1	1	1	8	0	0	-1
4	richDeposit	Rich Deposit	A stroke of luck in an otherwise unlucky day.	Gain {roll} resource{s} for this round.	1	1	1	8	0	0	1
5	urgentRepairs	Urgent Repairs	No pneumatic tires on mars, but there are always holes to patch.	{roll} resource{s} are immediately diverted to system health.	1	1	2	7	1	0	-1
6	hullBreach	Hull Breach	Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same.	Lose {roll} system health.	4	4	1	10	-1	0	0
7	softwareUpgrade	Software Upgrade	A much needed patch to the system comes online.	Gain {roll} system health.	4	4	1	10	1	0	0
8	lostCargo	Lost Cargo	Precious cargo, now forever Martian property.	Lose {roll} point{s}.	4	4	1	10	0	-1	0
9	hitTheMotherlode	Hit the Motherlode	A valuable find. Fortunately for us, not that useful for repairs.	Gain {roll} point{s}.	4	4	1	10	0	1	0
\.


--
-- Data for Name: solo_mars_event_deck; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_mars_event_deck (id) FROM stdin;
\.


--
-- Data for Name: solo_mars_event_deck_card; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_mars_event_deck_card (id, "dateCreated", "deckId", "cardId", "effectText", "systemHealthEffect", "resourcesEffect", "pointsEffect", "roundId") FROM stdin;
\.


--
-- Data for Name: solo_player; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_player (id, "userId", "playerIp", "gameId", points, "dateCreated") FROM stdin;
\.


--
-- Data for Name: solo_player_decision; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.solo_player_decision (id, "systemHealthInvestment", "pointsInvestment") FROM stdin;
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.student (id, "userId", "classroomId", "rejoinCode") FROM stdin;
25	30	1	zyionsx
26	31	1	xvepygh
27	32	1	oczuexs
28	33	1	naecsqj
29	34	1	mwajksd
30	35	1	krguenm
31	36	1	sudxwpz
32	37	1	insihou
33	38	1	nvrqgaf
34	39	1	bkuwkat
35	40	1	akwmmzg
36	41	1	lyjlvyd
37	42	1	epdetgu
38	43	1	cfvtxav
39	44	1	mfebamd
40	49	1	nqtufcy
41	50	1	vvegyne
42	51	1	nuabdbn
43	52	1	wobnasg
44	53	1	upsitxi
45	54	1	qnyxbiy
46	55	1	saisoet
47	56	1	qxbsoyr
48	57	1	fmkuebm
49	58	1	fejlbhn
50	59	1	ijyhkvo
51	60	1	urhwjbv
52	61	1	ybabugk
53	62	1	ttoohmm
55	63	1	lkxiadk
57	64	1	ipllzht
58	65	1	xlplagh
60	66	1	xljpbfy
62	67	1	vsoqode
63	68	1	urxtitd
64	69	1	ptgbksp
65	70	1	eykzwva
67	71	1	vcnpfff
69	72	1	kbqxjna
70	73	1	zudddza
71	74	1	izwdpqj
72	75	1	sxwadxd
73	76	1	ylgcftz
74	77	1	spachyj
75	78	1	rrwredt
76	79	1	turksbi
77	80	1	lcorzgj
78	81	1	rmxowcm
79	82	1	uhsjmmv
80	83	1	mxztiff
81	84	1	vwgjuei
82	85	1	abswwgx
83	86	1	hkbrhcd
84	87	1	xshfzge
85	88	1	fazheor
86	89	1	thkpypo
87	90	1	xoigrui
88	91	1	orikjjp
89	92	1	ncukmrn
90	93	1	eihmykp
91	94	1	yltbvji
93	95	1	qibqnoe
95	96	1	trvoros
140	144	60	zwcsadt
97	97	1	zinyqdt
141	145	60	ihqxxnp
98	98	1	nwakwil
142	146	60	bewkioj
99	99	1	fygktms
143	147	1	putzyls
100	100	1	yqimfck
101	101	1	wlbvsuk
102	102	1	vwjoufm
103	103	1	waultbh
104	104	1	ycslrck
105	105	1	rbjlqjo
106	106	1	lkdiktr
107	107	1	wnmoqcl
108	108	1	rnzxxbv
109	109	1	hesqpbr
110	110	1	cjjvfcb
111	111	1	iefymch
112	112	1	mfytuow
113	113	1	ayietlg
114	114	1	rsxbcac
115	115	1	irbtpqo
116	116	1	lvgqsys
117	117	1	ohgiwng
118	118	1	naxaorm
119	119	60	rnxnzyk
120	124	60	ynqgsqx
121	125	60	mlykgxu
122	126	60	wendgvr
123	127	60	hsrhsae
124	128	60	wokampv
125	129	60	wekixhe
126	130	60	rdroigs
127	131	60	myuqsdn
128	132	60	xddmloo
129	133	60	obrmryt
130	134	60	nqcgmxc
131	135	60	bmldati
132	136	60	dlvrjsj
133	137	76	vvizvhh
134	138	60	sgwokab
135	139	60	eccegbm
136	140	60	bsycycz
137	141	60	treefxa
138	142	60	eafztqe
139	143	60	xslhyrp
\.


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.teacher (id, "userId", password) FROM stdin;
1	1	1234
2	26	1234
\.


--
-- Data for Name: tournament; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.tournament (id, name, active, "dateCreated", "minNumberOfGameRounds", "maxNumberOfGameRounds", description) FROM stdin;
1	freeplay	f	2024-06-06 00:28:19.711636	8	12	\N
4	educator	t	2024-07-23 21:29:06.349279	8	12	\N
\.


--
-- Data for Name: tournament_round; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.tournament_round (id, "roundNumber", "numberOfGameRounds", "tournamentId", "introSurveyUrl", "exitSurveyUrl", "dateCreated", championship, announcement) FROM stdin;
1	1	10	1			2024-06-06 00:28:31.996898	f	
2	2	10	1			2024-06-06 22:52:18.53373	f	
3	3	10	1			2024-07-01 03:35:50.731282	f	
4	1	10	4			2024-07-23 21:29:20.651476	f	
5	4	10	1			2024-07-28 23:41:08.537342	f	
6	5	10	1			2024-07-28 23:45:47.666877	f	
7	6	10	1			2024-07-31 00:05:35.59769	f	
\.


--
-- Data for Name: tournament_round_date; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.tournament_round_date (id, "tournamentRoundId", "dateCreated", date) FROM stdin;
\.


--
-- Data for Name: tournament_round_invite; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.tournament_round_invite (id, "tournamentRoundId", "userId", "hasParticipated", "hasCompletedIntroSurvey", "hasCompletedExitSurvey", "dateCreated") FROM stdin;
\.


--
-- Data for Name: tournament_round_signup; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.tournament_round_signup ("tournamentRoundInviteId", "tournamentRoundDateId") FROM stdin;
\.


--
-- Data for Name: tournament_treatments_treatment; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.tournament_treatments_treatment ("tournamentId", "treatmentId") FROM stdin;
\.


--
-- Data for Name: treatment; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.treatment (id, name, description, "dateCreated", "marsEventOverrides") FROM stdin;
\.


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
GENERATED_COLUMN	port_of_mars	public	moderation_action	dateMuteExpires	case when "daysMuted" is not null then "dateCreated" + interval '1 day' * "daysMuted" else null end
GENERATED_COLUMN	port_of_mars	public	scheduled_game_date	lobbyCloseDate	"date" + interval '1 minute' * "minutesOpenAfter"
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: marsmadness
--

COPY public."user" (id, name, username, email, "passedQuiz", "registrationToken", "participantId", "isVerified", "dateConsented", "isActive", "dateCreated", "isAdmin", "passportId", "isSystemBot", "lastPlayerIp", "isBanned", "isMuted", "muteStrikes") FROM stdin;
1	test teacher	testteacher	test@example.com	f	fd0d63d9-4689-40b8-9580-c37f85f04f06	34399e7e-70fc-4323-bee1-1ae7eb7a4c6f	t	2024-06-06 22:44:33.573	t	2024-06-06 22:44:33.546198	f		f		f	f	0
2		LunarFox9068	\N	f	7ff3b6ff-c360-483d-898e-71b7e04a1fcf	a412cfbc-62ad-4fde-98db-aab126d4958f	f	\N	t	2024-06-06 22:52:56.671489	f		f		f	f	0
3		CometaryIbex2603	\N	f	83db4b78-97b2-4600-a436-bbbc288eedbb	845c27b4-aa29-4384-b53d-618ae2b99eaf	f	\N	t	2024-06-06 22:53:20.412523	f		f		f	f	0
4		SolarDolphin1672	\N	f	15765e27-3031-45d8-ac9f-f2cbf501d15c	beab1df8-134f-4436-976d-0123e893248e	f	\N	t	2024-06-06 22:53:46.746182	f		f		f	f	0
5		LunarFox6417	\N	f	0b718b03-4a95-4a19-add5-48cc33c2916a	4da1428d-469d-416d-8b7c-de3b4031772d	f	\N	t	2024-06-06 22:55:47.852297	f		f		f	f	0
6		NebularOrangutan2507	\N	f	803c5d27-b006-4fcb-9954-1d798d83dcce	df05f36a-f5d9-445d-9466-fa2207fb0c53	f	\N	t	2024-06-06 23:00:44.652767	f		f		f	f	0
7		EllipticalEagle4718	\N	f	bbc5814c-b90b-4995-9efb-8d074190ac35	87e91096-08b6-4f21-a9d5-6a6718ebdad4	f	\N	t	2024-06-06 23:06:01.528326	f		f		f	f	0
8		SolarCanary6228	\N	f	819336ba-8464-4e1c-97c8-21fc3a44bec8	60f1bbca-3795-4d75-809a-75962268f644	f	\N	t	2024-06-06 23:08:11.351667	f		f		f	f	0
9		IllustriousRaccoon6607	\N	f	dc8946d0-15b6-4542-8f3e-136ad4685927	216afd4c-b9a7-4e7c-8b2d-b7fe7f44341e	f	\N	t	2024-06-06 23:14:03.116687	f		f		f	f	0
10		LunarHeron7979	\N	f	f6e49c29-21ea-42d1-bac0-418e9fdac79b	3bd01a97-5235-4cd1-be77-574a6304cea9	f	\N	t	2024-06-06 23:15:01.773392	f		f		f	f	0
11		EllipticalOrangutan9140	\N	f	a20a1b61-95fe-4f63-a1f9-14e20918cefc	257eaf53-ca27-4c6f-8c96-fe49920e0eaa	f	\N	t	2024-06-06 23:19:50.103458	f		f		f	f	0
12		CometaryMeerkat2816	\N	f	7e526758-7e9a-4deb-a39b-e87e33798294	c875557a-e6cb-49a2-b748-ca3ca2f0db2a	f	\N	t	2024-06-06 23:20:56.617389	f		f		f	f	0
13		LunarOrangutan8739	\N	f	d3f75720-1d70-49b4-aec0-21ad5f4dbc31	d6fc4dfa-f2fa-427f-a1e4-403d6e562b9a	f	\N	t	2024-06-06 23:21:29.909379	f		f		f	f	0
14		AuroralEagle4911	\N	f	f03903a5-d548-4d7c-96d7-9f3c41c8d19a	5c836c00-ade3-4d85-ba4f-079b69471d48	f	\N	t	2024-06-07 05:21:24.564931	f		f		f	f	0
15		LunarGiraffe9238	\N	f	81e47c0c-47ca-49f3-a418-5678dad9cdd0	e6c74c75-278a-436c-8768-a84f9dce272e	f	\N	t	2024-06-07 05:28:36.883779	f		f		f	f	0
16		StellarCamel5210	\N	f	71b1d2a4-87f7-41a4-8923-09c5d4564a56	be8a5771-0e8e-4dcf-bcac-0efe17b254ad	f	\N	t	2024-06-07 23:35:42.621028	f		f		f	f	0
17		MartianGiraffe5526	\N	f	a86831f5-80b8-47f9-9574-13bc0c625a8d	f89ed5a2-9922-4fa6-8e77-c1c6b5e0c237	f	\N	t	2024-06-12 00:02:50.43267	f		f		f	f	0
18		PlanetaryCanary6738	\N	f	ab8d6d26-3f8c-4897-aac7-572ecdbcadfa	5c7b4f80-807e-4ef3-b0ab-db51c3c7a1ac	f	\N	t	2024-06-12 19:19:19.113444	f		f		f	f	0
19		CosmicHedgehog3639	\N	f	c0ecf843-f0fb-4b4b-abdd-332c5b09ab0d	797a6717-2b04-4255-82ea-be5cc38e6cbd	f	\N	t	2024-06-12 20:01:36.734193	f		f		f	f	0
20		AstralNewt3408	\N	f	d8e4c276-70c0-4464-87be-9833aa4d5142	502bdc08-f68a-4b07-9915-ef301066372e	f	\N	t	2024-06-12 20:06:37.053357	f		f		f	f	0
21		EllipticalWolverine3744	\N	f	45111eee-d471-460b-b854-5568cdec8cc3	6689aa14-f1cf-4ee4-9c57-1e3f6e2d2801	f	\N	t	2024-06-12 20:07:45.512808	f		f		f	f	0
22		NebularHeron6800	\N	f	0867792b-519f-4749-a61d-214679059c2a	aaa2c9c1-9684-4469-bc96-10da8871ddbd	f	\N	t	2024-06-14 02:19:59.001017	f		f		f	f	0
23		CometaryLizard2593	\N	f	15fb2251-81cf-4da0-83a1-10a88768ecd9	e9af4e6c-5df3-4696-932e-ff8e4fd997d6	f	\N	t	2024-06-14 06:14:41.615947	f		f		f	f	0
24		StellarDingo3982	\N	f	1b111823-9f03-47d9-ab93-f3f6842bf4d7	480eb551-5c4b-462f-bfa8-a61f0e7d1025	f	\N	t	2024-06-14 06:19:21.353101	f		f		f	f	0
25		EllipticalOrangutan4797	\N	f	8956c7ba-a375-4e2f-a3c9-c6ff59641298	3b6ac0b0-cb45-466b-9166-991d83ec2c38	f	\N	t	2024-06-14 21:17:44.9987	f		f		f	f	0
26	test teacher 3	testteacher3	test_teacher_3@example.com	f	19b24bd3-8f52-4dec-9f4a-4e1c0565ca10	9d3d9383-875f-4c32-bb33-81247d9c2c8b	t	2024-06-18 21:50:25.108	t	2024-06-18 21:50:25.084485	f		f		f	f	0
27		CometaryLizard4284	\N	f	0eb2996d-305c-4f24-a37a-5b6a7ceb8efe	119eda52-190a-4d69-91af-565ba150384f	f	\N	t	2024-06-18 21:56:22.613779	f		f		f	f	0
28		IllustriousLemur5167	\N	f	499ce711-4501-47a6-b57f-fd8327950848	8e570bcf-b139-4a33-b139-1b42baafbb31	f	\N	t	2024-06-18 21:56:35.46836	f		f		f	f	0
29		CometaryAntelope5303	\N	f	4632cbd3-171e-40d5-8e13-c80e13f01d9e	4986d6bc-6985-4988-b700-aef9b16252d6	f	\N	t	2024-06-18 21:58:46.862657	f		f		f	f	0
30	sab nel	IllustriousHedgehog5181	\N	f	8169cce7-d806-46b5-a2c2-5dae2d86ff4e	77a16094-250b-478b-b4ae-b497443d3088	f	\N	t	2024-06-18 22:06:27.433746	f		f		f	f	0
31	sab nel	MartianIguana3479	\N	f	23fccc3f-1d6a-4152-aec3-61270acc717a	cd26d76a-ed17-4e84-ac6b-20fca5dc4125	f	\N	t	2024-06-19 06:02:46.873541	f		f		f	f	0
32	sab nel	AuroralWolverine8833	\N	f	fe4a96df-b7fd-4fc0-9dd7-da695c377918	d36f93c6-1b07-4cdd-8e15-16e16310f6bf	f	\N	t	2024-06-19 21:28:29.682537	f		f		f	f	0
33	sab nel	StellarDolphin7272	\N	f	0bedf98d-8e02-415b-8467-ea03129dab4c	6ad122f3-8979-4179-9261-044f9e26aff0	f	\N	t	2024-06-19 21:35:43.714018	f		f		f	f	0
34	sab nel	CometaryRaccoon8388	\N	f	a1a4e016-9d76-4df2-ab99-6c8d07caf126	1a745c91-96a6-4424-9cf1-d2673e852b86	f	\N	t	2024-06-19 21:38:58.954209	f		f		f	f	0
35	sab nel	OrbitingEagle3724	\N	f	ef9d8838-df29-432d-9c08-7ac130f43128	1b34eccc-aad3-4d3e-bcde-6080def44362	f	\N	t	2024-06-20 18:22:46.943539	f		f		f	f	0
36	sab nel	EllipticalIbex3831	\N	f	bcdac578-23d0-4212-bccc-9f45e3d64940	08754075-c032-4a65-850b-8ce4fe5e149e	f	\N	t	2024-06-20 18:34:12.056106	f		f		f	f	0
37	sab nel	GalacticCamel9896	\N	f	2d114d68-681a-428c-b2f0-d017dd8fc287	04350976-02c6-4f0a-91ad-6aa7aed62e36	f	\N	t	2024-06-20 18:35:26.831505	f		f		f	f	0
38	 	GalacticAxolotl6910	\N	f	f550054e-6ff7-4d64-85ef-41be97fb000a	2dbea7f4-7dff-4cd3-b7e9-951bc167142e	f	\N	t	2024-06-20 18:39:20.394161	f		f		f	f	0
39	 	OrbitingAntelope1804	\N	f	9f68a296-9dae-468c-929d-bde6dcf3f9da	f0448583-1270-4add-ae60-f4cf831b8952	f	\N	t	2024-06-20 18:47:26.027869	f		f		f	f	0
40	 	OrbitingMeerkat1760	\N	f	bb5b08ad-811d-44ce-99c4-bd2469c68cfb	5f0c6dd0-bcd3-4207-8253-64c4a10a8d0d	f	\N	t	2024-06-20 18:50:36.232878	f		f		f	f	0
41	 	LunarHyena1921	\N	f	6aa64165-f513-418e-baf2-b6ac82b69d97	8ada6d68-8ebf-4711-b690-5ca339767fd0	f	\N	t	2024-06-20 18:52:56.298021	f		f		f	f	0
42	 	SolarLemur7011	\N	f	a08afa9f-42ed-4825-b295-18ed6e8475c8	c762a489-0b64-42ac-b328-78c2cf0b49a1	f	\N	t	2024-06-20 18:58:25.08566	f		f		f	f	0
43		AsteroidalDingo4669	\N	f	5d7b30be-ce6a-49a3-8fa5-8b48113b886c	fed85c44-7aa8-46da-8693-b3c1021d9d9f	f	\N	t	2024-06-20 18:58:58.584115	f		f		f	f	0
44		NebularCanary8941	\N	f	84477979-061d-4e64-bcf8-992bf03e2872	49098132-6099-4ae1-95cb-5c1b9a24beec	f	\N	t	2024-06-20 20:31:22.287622	f		f		f	f	0
45		InterstellarWolverine6186	\N	f	e86845d1-a032-40bd-aed4-cbb646fd1512	707e47f1-2192-46b9-bf87-1e0f0e23781f	f	\N	t	2024-06-24 19:01:05.001227	f		f		f	f	0
46		GalacticNewt8597	\N	f	18632e00-1ca5-4e27-8aad-833b3bb60112	2d20b68f-04f3-48b4-85c8-44f399197c00	f	\N	t	2024-06-24 19:01:14.520444	f		f		f	f	0
47		CosmicHeron9976	\N	f	3fbc20eb-bf39-4512-b20c-183596677806	67b5c010-9c66-488e-83fa-9c71c890f06e	f	\N	t	2024-06-24 19:07:57.729739	f		f		f	f	0
48		PlanetaryIbex5904	\N	f	14189301-7166-4687-8382-63ba52529a50	a2c697a3-2a0d-49e6-a2cd-0cf41afabe50	f	\N	t	2024-06-24 19:17:10.607345	f		f		f	f	0
49		StellarWolverine4790	\N	f	e46a8bde-32b7-4cf9-ae85-80300a4b7328	6a758552-1a96-4bbe-b0ca-70598051d372	f	\N	t	2024-06-25 20:00:22.761639	f		f		f	f	0
50		GalacticParrot5648	\N	f	03225f64-9ef2-40ac-8959-523b87e94507	57f63f9f-6dd4-4c2d-9021-e046098d8058	f	\N	t	2024-06-26 01:04:17.100703	f		f		f	f	0
51		LunarDolphin6755	\N	f	bacc86ee-db56-496e-8d97-88ff59d3d9c6	9c959b18-1734-44b6-8817-91b21b0913ac	f	\N	t	2024-06-26 01:04:24.901592	f		f		f	f	0
52		PlanetaryHeron4418	\N	f	7577cffb-6663-4e33-b312-802fecacc0cb	1367f84b-3403-48a8-bb45-3494a5c4a3a5	f	\N	t	2024-06-26 01:04:31.719098	f		f		f	f	0
53		OrbitingHeron8981	\N	f	ed93fafa-7a58-4edf-886a-d09343425fbb	916d0100-c245-4eb0-85c4-15dc3e872fea	f	\N	t	2024-06-26 01:17:27.363768	f		f		f	f	0
54		AstralHyena9142	\N	f	b79d711f-05d6-43f6-b18f-87dbfaed8bea	37e00eb9-0edf-4a2e-a21f-0680d74de7ec	f	\N	t	2024-06-26 01:38:53.580023	f		f		f	f	0
55		NebularFerret8911	\N	f	166c48b8-8449-4fc5-9535-e38bbc2d2de0	b3702b73-8eaf-47ee-8b76-5b824452bb09	f	\N	t	2024-06-26 01:42:41.455095	f		f		f	f	0
56		CosmicOrca5233	\N	f	955bccc5-13d7-48ac-8409-60b2d513a036	89765af9-0746-4b59-ade4-279878ed8896	f	\N	t	2024-06-26 01:47:07.77177	f		f		f	f	0
57		AuroralAntelope9350	\N	f	149de38c-70dd-4993-a4e7-8d4770e027c0	2891ed22-2374-4b17-840e-27972b7f6255	f	\N	t	2024-06-26 01:48:40.28823	f		f		f	f	0
58	Sabrina Nelson	SolarFalcon5048	\N	f	67dbba8a-0be8-4b4c-abf1-ffdea04f5ead	14d2cc37-fe00-4cfa-b337-6b42a3e3bc9f	f	\N	t	2024-06-26 16:38:44.023265	f		f		f	f	0
59	Sabrina Nelson	PlanetaryHedgehog8074	\N	f	217ecdab-c12a-4eda-a93a-9f40bc9632e3	9d89e483-63ac-42bb-880e-bd865e69b4f4	f	\N	t	2024-06-26 16:59:45.745115	f		f		f	f	0
60	sab nel	StellarFerret1447	\N	f	8355ef33-c434-4915-8554-1433516c061c	5f8c7867-1adb-45e1-99bb-c75dcf0f538c	f	\N	t	2024-06-26 17:02:38.122137	f		f		f	f	0
61	sab nel	GalacticIguana3820	\N	f	0b8ef984-d450-46f0-8f90-da9cc7ba42b2	ef4fa828-b586-4b90-babd-84ef10271490	f	\N	t	2024-06-26 17:04:52.671743	f		f		f	f	0
62		CometaryOrangutan6437	\N	f	9dc22d6f-0f6d-46cd-b731-072edd2c0c98	00ac2b1a-5ac6-4a4c-932f-4c067672338a	f	\N	t	2024-06-26 17:13:19.758346	f		f		f	f	0
63		LunarCanary1214	\N	f	165fb8aa-0332-4aef-819f-5147f43643c0	7e0cd09e-42f1-4ae7-8491-8eaf94cd6635	f	\N	t	2024-06-26 17:14:35.637319	f		f		f	f	0
64		LunarChameleon4519	\N	f	c1d9a7e5-29c1-4f4c-b34b-e388623b38f2	323706e5-74fd-4b81-ba9f-7f335120a75c	f	\N	t	2024-06-28 22:13:38.021921	f		f		f	f	0
65		PlanetaryKoala1353	\N	f	5697ebcb-ef5e-438a-9995-31c100acc95c	d7cbdce4-bc5c-4ed3-ac91-32288aaab55c	f	\N	t	2024-07-01 03:08:13.716644	f		f		f	f	0
66		LunarWolverine6661	\N	f	3f010fc4-6eaf-49c1-905f-008d7abf587c	3a9e74c2-232d-43fb-99cf-35d6a40043ab	f	\N	t	2024-07-01 03:09:38.9567	f		f		f	f	0
67		InterstellarFalcon8812	\N	f	127b77e7-4062-4d09-8244-2401a21046c0	b4745f07-fae9-4ac2-ab95-dd3ec9b8e54f	f	\N	t	2024-07-01 03:10:34.805526	f		f		f	f	0
68		StellarKoala9424	\N	f	19cf20d9-28fe-4e83-8fcd-447d88e5e934	2e0e2355-7f97-4696-ae43-bf566cad723e	f	\N	t	2024-07-01 03:11:25.484136	f		f		f	f	0
69		LunarDolphin9388	\N	f	97a2e9a0-edfc-4a37-acc2-5286a672173d	1edec00b-149f-496d-a0fa-83cd377e0305	f	\N	t	2024-07-01 03:12:32.687911	f		f		f	f	0
70		StellarRaccoon8166	\N	f	b9a8da3a-97d5-4f5e-a42e-b2a39e33f3b2	2ccbf7de-e61a-48b3-9604-e197a1b52c57	f	\N	t	2024-07-01 03:28:08.953132	f		f		f	f	0
71		StellarDingo8222	\N	f	46bd7656-23ab-4cb0-83ac-fbaa50f7f2f3	d16fe995-aa37-4498-87b4-454b15d8712e	f	\N	t	2024-07-01 18:02:32.015248	f		f		f	f	0
72		MartianMeerkat4482	\N	f	d7e3abcd-f476-4436-ab9e-3c90ef813fac	28708c3a-f0b3-4655-9712-450ec8d038a3	f	\N	t	2024-07-01 18:05:46.18281	f		f		f	f	0
73		OrbitingNewt9320	\N	f	eb483fc0-81f6-4667-aae9-b26bdb21164b	9811f2d5-6db9-4870-b978-5283a6282913	f	\N	t	2024-07-01 18:07:56.013825	f		f		f	f	0
74		CometaryBison3496	\N	f	2846880b-272c-4b9f-8bb9-ca450f1c2101	94c13415-c8c3-4f3f-9924-bcd7f6733620	f	\N	t	2024-07-01 18:17:29.155612	f		f		f	f	0
103	S N	InterstellarOrca7008	\N	f	bd499920-79f7-4f96-a92e-b2b51b00bc60	41d79c27-1af8-4802-8ba7-76ee3b9e3df8	t	\N	t	2024-07-02 21:12:09.607778	f		f		f	f	0
75	N asdf	NebularAxolotl1894	\N	f	c2656b00-9c7f-40d7-acfd-0249547d58a1	5e69645c-d4ad-4184-adcc-ec67b2104bdb	f	\N	t	2024-07-01 18:18:43.99537	f		f		f	f	0
76	Sab Nel	MartianFalcon4214	\N	f	c3dcc9e1-cfad-4b50-8b69-00af7c430d24	66c3e5a8-f4a9-401c-921d-1f0e6b6988ba	f	\N	t	2024-07-01 18:19:49.213417	f		f		f	f	0
77	s n	CometaryLemur5709	\N	f	4080fd5a-d09b-4499-9860-9e25837ae68f	4e518497-3fe2-4c9f-b263-2034c4a6bf48	f	\N	t	2024-07-01 18:22:06.347485	f		f		f	f	0
78	S N	PlanetaryRaccoon6096	\N	f	a8812d82-23ce-40da-9b08-389af9a3c484	0fc9b48a-cd17-4a71-b093-c11ff72b1a81	f	\N	t	2024-07-01 18:23:30.217972	f		f		f	f	0
79		MartianHyena2761	\N	f	c89cbfd8-73e1-4a82-8203-5ca8afca13af	2703cdcc-4085-49d8-9d0c-d71adaf19766	f	\N	t	2024-07-01 18:26:00.442955	f		f		f	f	0
80	sab nel	SolarParrot2319	\N	f	64b2d820-6ca0-4ae5-bf0c-8734d33ec19f	57da56f2-7db5-4318-aa37-3784ecb61a05	f	\N	t	2024-07-01 18:26:22.363283	f		f		f	f	0
81		AsteroidalOrangutan4273	\N	f	f8fc5cbe-9a50-4082-be51-d392147c4118	50ddb17d-4805-4c3e-92d6-8c7c69496e84	f	\N	t	2024-07-01 18:26:52.955182	f		f		f	f	0
82	S N	LunarEagle4396	\N	f	3036eb32-2e76-4e71-8e4e-9d27a9762a45	9f367d21-8172-4641-a317-237ef74b84e1	f	\N	t	2024-07-01 18:29:16.624623	f		f		f	f	0
83	sab nel	NebularQuagga2881	\N	f	9f7fdda9-46fd-4c88-beac-e2ff8bfeaaa3	a26a83b5-3a0f-47ec-a6db-5ef1767e7b43	f	\N	t	2024-07-01 22:26:29.165609	f		f		f	f	0
84	S N	OrbitingFalcon7132	\N	f	15a5fafc-7957-4c2b-97ad-c155b459e47f	d23fe328-c6d7-4c1c-aa72-071b23d1da97	f	\N	t	2024-07-01 22:30:53.875903	f		f		f	f	0
85	Sab nel	CelestialHedgehog3650	\N	f	732ae45b-50f0-478d-ad17-0fd5820f669f	561f181d-2838-452f-8b06-ace7e6e9fbcc	f	\N	t	2024-07-01 22:32:04.622771	f		f		f	f	0
86	sab nel	CometaryGiraffe9552	\N	f	92af4e40-53c5-42a7-b2fe-55ef062e17e7	2753726d-d486-435a-b4d6-29bcac9cd234	f	\N	t	2024-07-01 22:36:30.877461	f		f		f	f	0
87	Sab Nel	GalacticFerret7776	\N	f	d31f49eb-9895-4eb1-80a7-de1d8b54e021	10b44fd7-2383-44b5-88c9-31cd30f090bf	f	\N	t	2024-07-01 22:41:50.543276	f		f		f	f	0
88	sab nel	AsteroidalHedgehog9751	\N	f	23e967ff-d8ab-4a71-9b66-046e25e377e9	78684d1b-f6d6-4a23-9d42-eb97ee2e7b74	f	\N	t	2024-07-01 22:49:19.729018	f		f		f	f	0
89		AuroralWolverine6769	\N	f	57041e39-6b71-4350-b7ab-93c3e8a0abe0	70b270ce-a40f-4132-91ce-de4d007fc10e	f	\N	t	2024-07-01 22:50:19.333336	f		f		f	f	0
90	sab nel	NebularFalcon7755	\N	f	6b2d3667-0bd5-4110-9726-f0e5fdfa23e8	031cf10d-db09-4f92-b435-b40d57f6af8a	f	\N	t	2024-07-02 19:32:44.361847	f		f		f	f	0
91		SolarAntelope1246	\N	f	6d9585b0-e3b4-47f3-9209-aa97726669f1	f2b2c2ca-155e-41d4-a027-7b913136d89e	f	\N	t	2024-07-02 19:37:41.425531	f		f		f	f	0
92	sab nel	AsteroidalMeerkat1446	\N	f	c139f099-d18e-4729-9836-2b29d429b012	f89279db-6081-4778-8470-46d922ff0933	f	\N	t	2024-07-02 19:42:07.074328	f		f		f	f	0
93		MartianFox4035	\N	f	c7935d2b-bc8d-4f56-8b79-04275e86afcf	69314d68-43fa-468e-9c6e-f1323abb29cf	f	\N	t	2024-07-02 19:51:33.726559	f		f		f	f	0
94		PlanetaryMeerkat6541	\N	f	c62c6b23-e225-408c-8202-84ad773a7290	d53a0d45-62d6-4752-b0ad-64f48920a246	f	\N	t	2024-07-02 19:55:11.168223	f		f		f	f	0
95		GalacticNewt3211	\N	f	badb4349-d1e2-49c2-94f9-e072eb1d1dde	4f83873d-9a53-4366-8c51-dc438e2dd3d2	f	\N	t	2024-07-02 19:56:22.687744	f		f		f	f	0
96		NebularDolphin2105	\N	f	40475053-e069-4d87-a468-8b15729eb5ad	ff343282-8e31-40a8-8cb1-414254751b84	f	\N	t	2024-07-02 19:57:26.922593	f		f		f	f	0
97	Sab nel	AuroralLemur8957	\N	f	2f29e0d5-856e-4d18-82f8-92f91aeab580	e02196e4-90ad-4e4f-9704-4227f7e6773d	t	\N	t	2024-07-02 19:58:36.66568	f		f		f	f	0
98	sab nel	CosmicEagle9623	\N	f	795dd1df-5b2d-4d30-ab72-82f8a9d9fc98	731394c9-e110-43c9-8a66-6948c93e058e	t	\N	t	2024-07-02 19:58:51.138562	f		f		f	f	0
99	S N	AsteroidalRaccoon1291	\N	f	995e0109-4077-439c-b3cb-58862489f63c	19cf8f70-3116-4ab0-b173-99af1473f7ac	t	\N	t	2024-07-02 20:59:58.152642	f		f		f	f	0
100	S N	StellarCamel6303	\N	f	6ebba136-3c21-401a-8d81-0389e50c3144	bb2c97e9-1a68-4f02-9742-ec9b684ebae6	t	\N	t	2024-07-02 21:01:22.638793	f		f		f	f	0
101		InterstellarQuagga3102	\N	f	a74730ea-16fc-4218-87f6-fa30d3798c3d	8ea6613f-238f-4a24-948a-192e1b85681c	f	\N	t	2024-07-02 21:01:36.372871	f		f		f	f	0
102	Sabrina Nelson	LunarIbex9647	\N	f	1510316b-75d9-4ac1-9f53-fb3e9bf5a94f	157ee0a7-642e-40f5-a12c-15585371d8b8	t	\N	t	2024-07-02 21:09:00.901549	f		f		f	f	0
104	Sab Nel	EllipticalLemur8957	\N	f	7b0eca36-30f1-46d8-9c12-52c7b2f6dd24	ff5557ff-e85d-4871-a0c6-84a9d057f0ce	t	\N	t	2024-07-02 21:17:41.635092	f		f		f	f	0
105		StellarFox4417	\N	f	018febf0-e3c1-4530-8bee-4ea9abb544ef	b3191751-c0dc-4807-a558-b5339d2f92ae	f	\N	t	2024-07-03 04:10:23.329568	f		f		f	f	0
106	sab nel	CelestialCamel3749	\N	f	28c39520-0f04-4155-9ef0-cc322a2ccaed	169544e6-0e5e-49c0-b0ae-174467b0e910	t	\N	t	2024-07-03 04:24:04.473876	f		f		f	f	0
107	S N	SolarOrangutan2841	\N	f	ae7807be-ada9-4718-8113-f2db43b41e37	d113ddb2-ae0e-4abd-802f-d2898c356610	t	\N	t	2024-07-03 18:44:14.832135	f		f		f	f	0
108	S N	LunarHedgehog3764	\N	f	86645afb-79de-47ec-bf90-3b9a98172280	d8a977e3-fa0f-43be-a75b-5adefdbfc326	t	\N	t	2024-07-03 19:13:56.802159	f		f		f	f	0
109	S N	GalacticMarmot4936	\N	f	4c5af1ab-a5e5-4b0d-8284-6ee8bdebcc0a	bd93cfa7-2a70-4e04-8e19-dc2cd973d36c	t	\N	t	2024-07-03 19:20:41.113937	f		f		f	f	0
110		SolarRaccoon2995	\N	f	c44ac092-7ca8-4084-bd1a-0620db6897d8	166403c4-f59c-45c3-b4c2-c13b4148ebf9	f	\N	t	2024-07-03 19:24:26.417102	f		f		f	f	0
111	S N	InterstellarHedgehog4671	\N	f	8b61f411-fa20-47f3-900a-fa732b30020f	d1c67a70-bc20-4680-957f-a42f3530ab4b	t	\N	t	2024-07-03 19:24:46.468286	f		f		f	f	0
112	S N	IllustriousAxolotl4596	\N	f	a4f5badd-2e84-465f-b150-1bf64cbdceb1	ac7db814-0658-4e2a-bbf1-dc401413e9bf	t	\N	t	2024-07-05 23:59:00.443259	f		f		f	f	0
113	S N	AsteroidalAntelope4386	\N	f	64ef9b2f-0100-4054-9c10-84ac218c506c	fd3bc8e1-98ae-475e-9707-e5b4a767ca5b	t	\N	t	2024-07-06 05:31:08.777635	f		f		f	f	0
114	s n	SolarParrot7475	\N	f	bbaa6dfe-53b1-4889-90a3-f29c02aabfc2	6a494717-afd9-45a4-b7cb-5d44184d4070	t	\N	t	2024-07-08 01:38:29.067536	f		f		f	f	0
115	S N	GalacticHeron5255	\N	f	9600e5d8-73ca-4207-bd11-c9845ee4ea1b	05cb60ee-de75-4d7f-88f0-0b55fdee1654	t	\N	t	2024-07-09 00:21:40.428037	f		f		f	f	0
116	S N	IllustriousHedgehog7148	\N	f	c1edb820-0b6d-4ce1-8695-5c47d0e44501	1c845f8f-c0e3-48f5-a3f6-e0a4aa1ae048	t	\N	t	2024-07-09 21:40:25.464435	f		f		f	f	0
117		CelestialHeron3168	\N	f	f9ea6d0c-0284-4106-95aa-1addc5256a35	785c3a1e-e8ba-489d-a4fb-5238bce9b06f	f	\N	t	2024-07-10 23:03:05.113849	f		f		f	f	0
118	S N	CometaryHedgehog7941	\N	f	bb298950-0436-407b-ab92-40fdc8dba167	564ea5df-6a09-4bd2-9c37-3889db31f883	t	\N	t	2024-07-10 23:03:15.130597	f		f		f	f	0
120	robot MartianCamel3681	MartianCamel3681	\N	f	20a645c4-7fa2-49aa-a1a8-53880e7cb204	df646020-96ac-47bb-9cf5-372cb8688ae0	f	\N	t	2024-07-23 21:31:24.2094	f		t		f	f	0
121	robot LunarBison2329	LunarBison2329	\N	f	9eee4850-948c-49c0-b25f-162aa9450c93	a5a2fb2f-d589-4341-afae-78cc7add710f	f	\N	t	2024-07-23 21:31:24.239253	f		t		f	f	0
122	robot SolarCamel3847	SolarCamel3847	\N	f	7e981dec-2f42-46e9-bc1c-72652cb590e2	6030f331-1d99-4d08-ae28-94ee2c63f7e1	f	\N	t	2024-07-23 21:31:24.245632	f		t		f	f	0
123	robot AuroralCamel4881	AuroralCamel4881	\N	f	d1b076d1-52e4-43f3-b7ba-456653d79e09	d291cc02-b427-43cb-9e5b-0ab9bc94bf79	f	\N	t	2024-07-23 21:31:24.249532	f		t		f	f	0
119	S N	GalacticCanary4199	\N	f	0cb1b7a1-f1eb-410e-b4cf-959fa151068f	dd21de89-9784-44af-b023-507d2c31e513	t	\N	t	2024-07-23 21:30:45.859595	f		f	::ffff:172.24.0.1	f	f	0
124	S N	IllustriousGiraffe8998	\N	f	f90c4fc3-eef9-467f-8145-f102a66f9397	88aa6444-2304-4c18-9768-b14267888089	t	\N	t	2024-07-25 01:50:04.928013	f		f		f	f	0
125	S N	InterstellarStarfish6735	\N	f	71894e52-ba88-479e-ac1d-d9a6c5e53e92	36652c9f-0dfa-497c-a2ca-74775bb828ef	t	\N	t	2024-07-25 01:54:12.036175	f		f	::ffff:172.25.0.1	f	f	0
126	Sab Nel	SolarWolverine8632	\N	f	7606142b-7b59-456f-acdd-f76e71b4171a	11641067-ced0-475f-9a9f-d50e019931e1	t	\N	t	2024-07-25 01:54:55.731517	f		f	::ffff:172.25.0.1	f	f	0
127	S N	AuroralLizard4476	\N	f	8e9bfca1-761d-4b26-9b3a-19119ddbd1b8	a46e8857-1984-4c5a-94e2-1f8e3519b3b6	t	\N	t	2024-07-25 04:23:43.076032	f		f		f	f	0
128	S N	PlanetaryQuagga6458	\N	f	900a6a74-6798-4192-9202-b46cd503f34e	14cdb70e-4b20-45d6-bbaf-cc8c8828eb67	t	\N	t	2024-07-26 22:49:24.989699	f		f	::ffff:172.28.0.1	f	f	0
129	S N	LunarFox6831	\N	f	2e9b21d6-5a41-4167-b632-48d7bcfcd923	c47fefb4-cb14-4626-82da-20b282a55f83	t	\N	t	2024-07-26 23:01:16.560227	f		f		f	f	0
130	S N	CosmicRaccoon5930	\N	f	3ca24074-54c9-4e70-87eb-e8e0f7aaedad	aada0ee9-4124-4b83-9fb3-1c58687788a9	t	\N	t	2024-07-27 21:55:31.250449	f		f		f	f	0
131	Test  Student 1	AuroralOrangutan5597	\N	f	784ebddd-537d-4286-9999-d4c01798285c	4ac77a6f-e9a1-47a6-b709-307d30402194	t	\N	t	2024-07-29 00:03:45.239061	f		f		f	f	0
132	Test Student 2	PlanetaryFalcon2257	\N	f	3b2a8940-301f-4fc1-8ec7-575650875660	f52552cc-946a-4cfe-a363-f7a787f4f7f0	t	\N	t	2024-07-29 00:04:16.925893	f		f		f	f	0
133	Sabrina Nelson	AsteroidalBison5563	\N	f	680a0861-d8b6-4b79-959d-ac7ce07a66ab	cbbe8c60-dea9-4712-831b-272b6850a037	t	\N	t	2024-07-30 03:46:08.204219	f		f		f	f	0
134	Sabrina Nelson	CometaryAxolotl5045	\N	f	b8eb41c0-fef6-451c-90f2-813931296501	af2da181-6866-4e89-b293-f58a08b2d513	t	\N	t	2024-07-30 03:48:22.029302	f		f		f	f	0
135	Sabrina Nelson	LunarMarmot7251	\N	f	aa885542-7f1a-4d0e-977c-04ad77f8cee7	d406afc6-e321-4245-a71d-d003f48556b9	t	\N	t	2024-07-30 04:09:27.430334	f		f		f	f	0
136	Sab Nel	StellarFalcon6452	\N	f	d36db8a7-f888-4d23-a50d-e890feca999e	792db984-fee9-485d-a072-c090c4088824	t	\N	t	2024-07-30 23:58:05.252428	f		f		f	f	0
137	Sabrina Nelson	GalacticOrangutan9195	\N	f	5d590255-d01c-4f36-9854-33712ed559ce	d58b511d-f2db-414e-a949-4934370f5b84	t	\N	t	2024-07-31 00:07:18.73585	f		f		f	f	0
138	Sab Nel	LunarFalcon4386	\N	f	b8ce914e-4c6a-42f4-b354-2d71762dbe1e	6e2b2a1b-5900-4449-8ea2-992d83724e64	t	\N	t	2024-07-31 00:09:51.961939	f		f		f	f	0
139	Hailey Nelson	MartianCanary9920	\N	f	49165a28-6bb1-41cb-bd43-b5e30228fb39	ed488308-a1a6-4ef9-8855-0b378f95a556	t	\N	t	2024-07-31 00:26:50.429719	f		f		f	f	0
140	Sabrina Nelson	CelestialStarfish3364	\N	f	ecf2079f-fa5b-42a7-854a-1160bbf0b20c	29b93fa7-a953-4aef-947d-8e293c0b34e8	t	\N	t	2024-07-31 00:30:14.456242	f		f		f	f	0
141		NebularGiraffe8754	\N	f	34079aba-0780-4e40-b033-2b8c48217f20	e17665dd-b660-4fc1-a033-9852a2449de0	f	\N	t	2024-07-31 00:37:45.274851	f		f		f	f	0
142	S N	AuroralLizard2453	\N	f	3c8cadaf-cc7e-4222-bce7-289e6f5ed00f	33694f5d-7c08-4c09-b7cd-8e81f7e7cc3b	t	\N	t	2024-07-31 00:41:21.1586	f		f		f	f	0
143	S N	CometaryChameleon8159	\N	f	37fcddc6-f5ad-4fbb-b141-b7f49e10531f	b1ebebd7-56bb-4e60-82fa-d3479b6f3b27	t	\N	t	2024-07-31 00:43:01.544398	f		f		f	f	0
144	S N	GalacticHedgehog8483	\N	f	bad7059f-8081-4df6-94a5-ba2edb883ce9	6d3e7671-05ca-4c78-858d-2f59bc9bb0de	t	\N	t	2024-07-31 00:46:40.011887	f		f		f	f	0
145	S N	NebularFalcon4036	\N	f	e5472e99-cf7d-44ae-a5d7-2a7b4222f6f0	e5d49bfc-6bf6-4ab2-806b-3a950a90adb5	t	\N	t	2024-07-31 00:58:08.265562	f		f	::ffff:172.18.0.1	f	f	0
146	S N	CosmicMeerkat1348	\N	f	153b94a9-24c2-4178-97b6-9a4e865f38b0	293f443f-36a4-4a4a-88bb-d2597da69cc6	t	\N	t	2024-07-31 00:59:22.788685	f		f		f	f	0
147	S N	SolarParrot3600	\N	f	7dac33e1-0545-40f9-b8ca-edbd5499ab09	df7a45b2-872a-4d74-8416-c15e9565b706	t	\N	t	2024-08-16 20:20:22.069753	f		f		f	f	0
\.


--
-- Name: chat_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.chat_report_id_seq', 1, false);


--
-- Name: classroom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.classroom_id_seq', 93, true);


--
-- Name: game_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.game_event_id_seq', 1219, true);


--
-- Name: game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.game_id_seq', 6, true);


--
-- Name: lobby_chat_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.lobby_chat_message_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.migrations_id_seq', 33, true);


--
-- Name: moderation_action_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.moderation_action_id_seq', 1, false);


--
-- Name: player_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.player_id_seq', 30, true);


--
-- Name: question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.question_id_seq', 1, false);


--
-- Name: question_response_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.question_response_id_seq', 1, false);


--
-- Name: quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.quiz_id_seq', 1, false);


--
-- Name: quiz_submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.quiz_submission_id_seq', 1, false);


--
-- Name: solo_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_game_id_seq', 1, false);


--
-- Name: solo_game_round_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_game_round_id_seq', 1, false);


--
-- Name: solo_game_treatment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_game_treatment_id_seq', 12, true);


--
-- Name: solo_high_score_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_high_score_id_seq', 1, false);


--
-- Name: solo_mars_event_card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_mars_event_card_id_seq', 9, true);


--
-- Name: solo_mars_event_deck_card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_mars_event_deck_card_id_seq', 1, false);


--
-- Name: solo_mars_event_deck_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_mars_event_deck_id_seq', 1, false);


--
-- Name: solo_player_decision_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_player_decision_id_seq', 1, false);


--
-- Name: solo_player_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.solo_player_id_seq', 1, false);


--
-- Name: student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.student_id_seq', 143, true);


--
-- Name: teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.teacher_id_seq', 2, true);


--
-- Name: tournament_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.tournament_id_seq', 8, true);


--
-- Name: tournament_round_date_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.tournament_round_date_id_seq', 1, false);


--
-- Name: tournament_round_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.tournament_round_id_seq', 7, true);


--
-- Name: tournament_round_invite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.tournament_round_invite_id_seq', 1, false);


--
-- Name: treatment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.treatment_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marsmadness
--

SELECT pg_catalog.setval('public.user_id_seq', 147, true);


--
-- Name: moderation_action PK_152a7fb29b5a2bfc5fa43a96806; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.moderation_action
    ADD CONSTRAINT "PK_152a7fb29b5a2bfc5fa43a96806" PRIMARY KEY (id);


--
-- Name: question PK_21e5786aa0ea704ae185a79b2d5; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY (id);


--
-- Name: teacher PK_2f807294148612a9751dacf1026; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT "PK_2f807294148612a9751dacf1026" PRIMARY KEY (id);


--
-- Name: game PK_352a30652cd352f552fef73dec5; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY (id);


--
-- Name: solo_mars_event_deck_card PK_39035f7fd267d19f4863843efeb; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_deck_card
    ADD CONSTRAINT "PK_39035f7fd267d19f4863843efeb" PRIMARY KEY (id);


--
-- Name: student PK_3d8016e1cb58429474a3c041904; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY (id);


--
-- Name: tournament_round PK_40931a39f30039b3de581bf4806; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round
    ADD CONSTRAINT "PK_40931a39f30039b3de581bf4806" PRIMARY KEY (id);


--
-- Name: solo_game_round PK_410930ce91d0fb7658ac8e5203d; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game_round
    ADD CONSTRAINT "PK_410930ce91d0fb7658ac8e5203d" PRIMARY KEY (id);


--
-- Name: quiz PK_422d974e7217414e029b3e641d0; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY (id);


--
-- Name: tournament PK_449f912ba2b62be003f0c22e767; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT "PK_449f912ba2b62be003f0c22e767" PRIMARY KEY (id);


--
-- Name: lobby_chat_message PK_4640a139c74b0d188cc5efdda33; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.lobby_chat_message
    ADD CONSTRAINT "PK_4640a139c74b0d188cc5efdda33" PRIMARY KEY (id);


--
-- Name: tournament_treatments_treatment PK_51fb9e4c95d17614ddf43ff04a0; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_treatments_treatment
    ADD CONSTRAINT "PK_51fb9e4c95d17614ddf43ff04a0" PRIMARY KEY ("tournamentId", "treatmentId");


--
-- Name: solo_high_score PK_52d621b5047f8eb9a6861975622; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_high_score
    ADD CONSTRAINT "PK_52d621b5047f8eb9a6861975622" PRIMARY KEY (id);


--
-- Name: treatment PK_5ed256f72665dee35f8e47b416e; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.treatment
    ADD CONSTRAINT "PK_5ed256f72665dee35f8e47b416e" PRIMARY KEY (id);


--
-- Name: tournament_round_date PK_608a88e29bcf26ffee33446e25f; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_date
    ADD CONSTRAINT "PK_608a88e29bcf26ffee33446e25f" PRIMARY KEY (id);


--
-- Name: solo_game_treatment PK_61a365004e22a4d84b35711f4c0; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game_treatment
    ADD CONSTRAINT "PK_61a365004e22a4d84b35711f4c0" PRIMARY KEY (id);


--
-- Name: player PK_65edadc946a7faf4b638d5e8885; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY (id);


--
-- Name: solo_player PK_6b0ee07ab2bf9b16ad83c4f921c; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_player
    ADD CONSTRAINT "PK_6b0ee07ab2bf9b16ad83c4f921c" PRIMARY KEY (id);


--
-- Name: classroom PK_729f896c8b7b96ddf10c341e6ff; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.classroom
    ADD CONSTRAINT "PK_729f896c8b7b96ddf10c341e6ff" PRIMARY KEY (id);


--
-- Name: solo_mars_event_card PK_7947d532c97b8ca371fb460d01c; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_card
    ADD CONSTRAINT "PK_7947d532c97b8ca371fb460d01c" PRIMARY KEY (id);


--
-- Name: solo_mars_event_deck PK_875bc3785d3916d7e5c5807d3a9; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_deck
    ADD CONSTRAINT "PK_875bc3785d3916d7e5c5807d3a9" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: tournament_round_invite PK_921655be23744634aaadf3568a5; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_invite
    ADD CONSTRAINT "PK_921655be23744634aaadf3568a5" PRIMARY KEY (id);


--
-- Name: tournament_round_signup PK_9ca713344f84fdcb0a29418ab48; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_signup
    ADD CONSTRAINT "PK_9ca713344f84fdcb0a29418ab48" PRIMARY KEY ("tournamentRoundInviteId", "tournamentRoundDateId");


--
-- Name: solo_player_decision PK_a39283302b3ed8728f66b8108fa; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_player_decision
    ADD CONSTRAINT "PK_a39283302b3ed8728f66b8108fa" PRIMARY KEY (id);


--
-- Name: solo_game PK_a941170fd23d55a87d4e49cca7f; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game
    ADD CONSTRAINT "PK_a941170fd23d55a87d4e49cca7f" PRIMARY KEY (id);


--
-- Name: quiz_submission PK_af730e984e8f6f25b5667a5d7be; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.quiz_submission
    ADD CONSTRAINT "PK_af730e984e8f6f25b5667a5d7be" PRIMARY KEY (id);


--
-- Name: question_response PK_b6c14a10d1d808f247ad89f4685; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.question_response
    ADD CONSTRAINT "PK_b6c14a10d1d808f247ad89f4685" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: game_event PK_d979b8a4d47b02b8f87322f33e0; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game_event
    ADD CONSTRAINT "PK_d979b8a4d47b02b8f87322f33e0" PRIMARY KEY (id);


--
-- Name: chat_report PK_ebb459eb4da2a5061ff8d6e415e; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.chat_report
    ADD CONSTRAINT "PK_ebb459eb4da2a5061ff8d6e415e" PRIMARY KEY (id);


--
-- Name: solo_game REL_39a6a51dc8dbc70626d59fe06d; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game
    ADD CONSTRAINT "REL_39a6a51dc8dbc70626d59fe06d" UNIQUE ("deckId");


--
-- Name: teacher REL_4f596730e16ee49d9b081b5d8e; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT "REL_4f596730e16ee49d9b081b5d8e" UNIQUE ("userId");


--
-- Name: solo_game_round REL_a31e55e614589c1806a4b96f15; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game_round
    ADD CONSTRAINT "REL_a31e55e614589c1806a4b96f15" UNIQUE ("decisionId");


--
-- Name: student REL_b35463776b4a11a3df3c30d920; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "REL_b35463776b4a11a3df3c30d920" UNIQUE ("userId");


--
-- Name: game REL_cd57acb58d1147c23da5cd09ca; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "REL_cd57acb58d1147c23da5cd09ca" UNIQUE ("winnerId");


--
-- Name: solo_game REL_ee276d60507980ddead8f08c80; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game
    ADD CONSTRAINT "REL_ee276d60507980ddead8f08c80" UNIQUE ("playerId");


--
-- Name: tournament UQ_39c996e461f5fe152d4811f9e54; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT "UQ_39c996e461f5fe152d4811f9e54" UNIQUE (name);


--
-- Name: tournament_round_invite UQ_4604294bf59d5e001f0361f2a33; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_invite
    ADD CONSTRAINT "UQ_4604294bf59d5e001f0361f2a33" UNIQUE ("userId", "tournamentRoundId");


--
-- Name: classroom UQ_5001c4e5dbc1507f8ad6578f3e1; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.classroom
    ADD CONSTRAINT "UQ_5001c4e5dbc1507f8ad6578f3e1" UNIQUE ("authToken");


--
-- Name: student UQ_77adce5802e7f39e1fb53885c8f; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "UQ_77adce5802e7f39e1fb53885c8f" UNIQUE ("rejoinCode");


--
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_03fa7ee872d41e983bdda793fc; Type: INDEX; Schema: public; Owner: marsmadness
--

CREATE INDEX "IDX_03fa7ee872d41e983bdda793fc" ON public.tournament_treatments_treatment USING btree ("tournamentId");


--
-- Name: IDX_38eaef09c6bb65d223f53e8d74; Type: INDEX; Schema: public; Owner: marsmadness
--

CREATE INDEX "IDX_38eaef09c6bb65d223f53e8d74" ON public.tournament_treatments_treatment USING btree ("treatmentId");


--
-- Name: tournament_treatments_treatment FK_03fa7ee872d41e983bdda793fc3; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_treatments_treatment
    ADD CONSTRAINT "FK_03fa7ee872d41e983bdda793fc3" FOREIGN KEY ("tournamentId") REFERENCES public.tournament(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tournament_round_date FK_0d1fb1e55339e433e212fbd7212; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_date
    ADD CONSTRAINT "FK_0d1fb1e55339e433e212fbd7212" FOREIGN KEY ("tournamentRoundId") REFERENCES public.tournament_round(id);


--
-- Name: tournament_round_invite FK_10661028f07a7359fbbb45e4345; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_invite
    ADD CONSTRAINT "FK_10661028f07a7359fbbb45e4345" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: tournament_round_invite FK_190cbb0d8573db49e599c973d5f; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_invite
    ADD CONSTRAINT "FK_190cbb0d8573db49e599c973d5f" FOREIGN KEY ("tournamentRoundId") REFERENCES public.tournament_round(id);


--
-- Name: question_response FK_1bb7171618902f1d1935002f979; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.question_response
    ADD CONSTRAINT "FK_1bb7171618902f1d1935002f979" FOREIGN KEY ("submissionId") REFERENCES public.quiz_submission(id);


--
-- Name: classroom FK_2b3c1fa62762d7d0e828c139130; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.classroom
    ADD CONSTRAINT "FK_2b3c1fa62762d7d0e828c139130" FOREIGN KEY ("teacherId") REFERENCES public.teacher(id);


--
-- Name: tournament_treatments_treatment FK_38eaef09c6bb65d223f53e8d74f; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_treatments_treatment
    ADD CONSTRAINT "FK_38eaef09c6bb65d223f53e8d74f" FOREIGN KEY ("treatmentId") REFERENCES public.treatment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solo_game FK_39a6a51dc8dbc70626d59fe06db; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game
    ADD CONSTRAINT "FK_39a6a51dc8dbc70626d59fe06db" FOREIGN KEY ("deckId") REFERENCES public.solo_mars_event_deck(id);


--
-- Name: moderation_action FK_41198e6096b6a55b1f5c5549beb; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.moderation_action
    ADD CONSTRAINT "FK_41198e6096b6a55b1f5c5549beb" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: student FK_426224f5597213259b1d58fc0f4; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "FK_426224f5597213259b1d58fc0f4" FOREIGN KEY ("classroomId") REFERENCES public.classroom(id);


--
-- Name: tournament_round FK_427f88a9c9475d0c248c0321736; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round
    ADD CONSTRAINT "FK_427f88a9c9475d0c248c0321736" FOREIGN KEY ("tournamentId") REFERENCES public.tournament(id);


--
-- Name: solo_game_round FK_4561cd9a73086f238bc0433e0d2; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game_round
    ADD CONSTRAINT "FK_4561cd9a73086f238bc0433e0d2" FOREIGN KEY ("gameId") REFERENCES public.solo_game(id);


--
-- Name: question FK_4959a4225f25d923111e54c7cd2; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES public.quiz(id);


--
-- Name: chat_report FK_4bcf26a31b96ed582fe5492e5da; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.chat_report
    ADD CONSTRAINT "FK_4bcf26a31b96ed582fe5492e5da" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: teacher FK_4f596730e16ee49d9b081b5d8e5; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT "FK_4f596730e16ee49d9b081b5d8e5" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: quiz_submission FK_611bef6102c491c49be42432c17; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.quiz_submission
    ADD CONSTRAINT "FK_611bef6102c491c49be42432c17" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: moderation_action FK_64cb2162b81e4f4c4d778f1ed2d; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.moderation_action
    ADD CONSTRAINT "FK_64cb2162b81e4f4c4d778f1ed2d" FOREIGN KEY ("reportId") REFERENCES public.chat_report(id);


--
-- Name: solo_high_score FK_71c90c349c4faf3b1f071edaec3; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_high_score
    ADD CONSTRAINT "FK_71c90c349c4faf3b1f071edaec3" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: game_event FK_71fa66873a3ea8dabfa3b267432; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game_event
    ADD CONSTRAINT "FK_71fa66873a3ea8dabfa3b267432" FOREIGN KEY ("gameId") REFERENCES public.game(id);


--
-- Name: solo_mars_event_deck_card FK_732e7ef62231a3b1f8a692b9ca9; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_deck_card
    ADD CONSTRAINT "FK_732e7ef62231a3b1f8a692b9ca9" FOREIGN KEY ("roundId") REFERENCES public.solo_game_round(id);


--
-- Name: player FK_7687919bf054bf262c669d3ae21; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT "FK_7687919bf054bf262c669d3ae21" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: solo_mars_event_deck_card FK_794e3e38b173d64eec1f2962996; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_deck_card
    ADD CONSTRAINT "FK_794e3e38b173d64eec1f2962996" FOREIGN KEY ("cardId") REFERENCES public.solo_mars_event_card(id);


--
-- Name: tournament_round_signup FK_7a74b3434f7b9fd1e2dd345128c; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_signup
    ADD CONSTRAINT "FK_7a74b3434f7b9fd1e2dd345128c" FOREIGN KEY ("tournamentRoundDateId") REFERENCES public.tournament_round_date(id);


--
-- Name: solo_game FK_7ba902b4f916952de522fbf7d0e; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game
    ADD CONSTRAINT "FK_7ba902b4f916952de522fbf7d0e" FOREIGN KEY ("treatmentId") REFERENCES public.solo_game_treatment(id);


--
-- Name: player FK_7dfdd31fcd2b5aa3b08ed15fe8a; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES public.game(id);


--
-- Name: question_response FK_91f0c1f6c501e01525c9db6df29; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.question_response
    ADD CONSTRAINT "FK_91f0c1f6c501e01525c9db6df29" FOREIGN KEY ("questionId") REFERENCES public.question(id);


--
-- Name: lobby_chat_message FK_96a0bc5d48c597dbd5ea6400feb; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.lobby_chat_message
    ADD CONSTRAINT "FK_96a0bc5d48c597dbd5ea6400feb" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: solo_game_round FK_a31e55e614589c1806a4b96f158; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game_round
    ADD CONSTRAINT "FK_a31e55e614589c1806a4b96f158" FOREIGN KEY ("decisionId") REFERENCES public.solo_player_decision(id);


--
-- Name: solo_mars_event_deck_card FK_a48822e171d01382a35c0d087fb; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_mars_event_deck_card
    ADD CONSTRAINT "FK_a48822e171d01382a35c0d087fb" FOREIGN KEY ("deckId") REFERENCES public.solo_mars_event_deck(id);


--
-- Name: student FK_b35463776b4a11a3df3c30d920a; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "FK_b35463776b4a11a3df3c30d920a" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: moderation_action FK_b63b644db636b8abd2d4cfaf54d; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.moderation_action
    ADD CONSTRAINT "FK_b63b644db636b8abd2d4cfaf54d" FOREIGN KEY ("adminId") REFERENCES public."user"(id);


--
-- Name: game FK_c02c037ca5f7f6d22d82c4e18fa; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "FK_c02c037ca5f7f6d22d82c4e18fa" FOREIGN KEY ("tournamentRoundId") REFERENCES public.tournament_round(id);


--
-- Name: game FK_c788ccf03f8452ec179982a4fbc; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "FK_c788ccf03f8452ec179982a4fbc" FOREIGN KEY ("treatmentId") REFERENCES public.treatment(id);


--
-- Name: game FK_cd57acb58d1147c23da5cd09cae; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES public.player(id);


--
-- Name: quiz_submission FK_d80e4bff3be137d3f97a5ac42d7; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.quiz_submission
    ADD CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7" FOREIGN KEY ("quizId") REFERENCES public.quiz(id);


--
-- Name: tournament_round_signup FK_e23420d741d9efa72888f948d8e; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.tournament_round_signup
    ADD CONSTRAINT "FK_e23420d741d9efa72888f948d8e" FOREIGN KEY ("tournamentRoundInviteId") REFERENCES public.tournament_round_invite(id);


--
-- Name: chat_report FK_e2629ead95a4b6c06436b708505; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.chat_report
    ADD CONSTRAINT "FK_e2629ead95a4b6c06436b708505" FOREIGN KEY ("gameId") REFERENCES public.game(id);


--
-- Name: solo_game FK_ee276d60507980ddead8f08c80a; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_game
    ADD CONSTRAINT "FK_ee276d60507980ddead8f08c80a" FOREIGN KEY ("playerId") REFERENCES public.solo_player(id);


--
-- Name: solo_player FK_f3655aa944db2032d6d9453c5c7; Type: FK CONSTRAINT; Schema: public; Owner: marsmadness
--

ALTER TABLE ONLY public.solo_player
    ADD CONSTRAINT "FK_f3655aa944db2032d6d9453c5c7" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: marsmadness
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

