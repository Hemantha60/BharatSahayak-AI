import { useEffect, useRef, useState } from "react";
import {
  ThumbsUp,
  Share2,
  ThumbsDown,
  ArrowRight,
  Globe2,
  Mic,
  Send,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronDown,
  X,
  LoaderCircle,
  ExternalLink,
  History,
  Plus,
  Trash2,
  User,
  LogOut,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
} from "lucide-react";

import "./App.css";

const LANGUAGES = [
  {
    name: "English",
    native: "English",
    speechCode: "en-IN",
  },
  {
    name: "Kannada",
    native: "ಕನ್ನಡ",
    speechCode: "kn-IN",
  },
  {
    name: "Hindi",
    native: "हिन्दी",
    speechCode: "hi-IN",
  },
];

const HISTORY_KEY = "bharatSahayakHistory";
const USERS_KEY = "bharatSahayakUsers";
const SESSION_KEY = "bharatSahayakSession";
const EXPLORE_CATEGORIES = [
  {
    title: "Agriculture",
    icon: "🌾",
    description:
      "Crop guidance, farming information, schemes and more.",
    question:
      "What government schemes and useful services are available for farmers in India?",
  },
  {
    title: "Education",
    icon: "🎓",
    description:
      "Courses, scholarships, exams and learning guidance.",
    question:
      "What scholarships and education opportunities are available for students in India?",
  },
  {
    title: "Jobs & Careers",
    icon: "💼",
    description:
      "Career guidance, skills, jobs and opportunities.",
    question:
      "What are some useful government and private job opportunities and career resources in India?",
  },
  {
    title: "Government Services",
    icon: "🏛️",
    description:
      "Government schemes, certificates and online services.",
    question:
      "What important government services can citizens access online in India?",
  },
  {
    title: "Public Services",
    icon: "🏥",
    description:
      "Health, transport and essential public services.",
    question:
      "What important public services are available to citizens in India?",
  },
  {
    title: "General Information",
    icon: "🇮🇳",
    description:
      "Ask questions about India, technology, society and more.",
    question:
      "Tell me some useful information and services that every citizen in India should know about.",
  },
];

function App() {
  // ==================================================
  // AUTHENTICATION
  // ==================================================

  const [authMode, setAuthMode] = useState("login");

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [currentUser, setCurrentUser] =
    useState(null);

  const [authName, setAuthName] =
    useState("");

  const [authEmail, setAuthEmail] =
    useState("");

  const [authPassword, setAuthPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [authError, setAuthError] =
    useState("");

  const [authLoading, setAuthLoading] =
    useState(false);

  // ==================================================
  // MAIN APP
  // ==================================================

  const [language, setLanguage] =
    useState("English");

  const [showLanguages, setShowLanguages] =
    useState(false);

  const [showChat, setShowChat] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // ==================================================
  // VOICE
  // ==================================================

  const [isListening, setIsListening] =
    useState(false);

  const [speakingIndex, setSpeakingIndex] =
    useState(null);

  const [feedback, setFeedback] = useState({});

  const recognitionRef =
    useRef(null);

  // ==================================================
  // HISTORY
  // ==================================================

  const [history, setHistory] =
    useState([]);

  const [showHistory, setShowHistory] =
    useState(false);

  // ==================================================
  // CURRENT LANGUAGE
  // ==================================================

  const currentLanguage =
    LANGUAGES.find(
      (item) => item.name === language
    ) || LANGUAGES[0];

  // ==================================================
  // LOAD SESSION
  // ==================================================

  useEffect(() => {
    try {
      const savedSession =
        localStorage.getItem(
          SESSION_KEY
        );

      if (savedSession) {
        const session =
          JSON.parse(savedSession);

        if (session) {
          setCurrentUser(session);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error(
        "Could not load login session:",
        error
      );
    }
  }, []);

  // ==================================================
  // LOAD HISTORY
  // ==================================================

  useEffect(() => {
    try {
      const savedHistory =
        localStorage.getItem(
          HISTORY_KEY
        );

      if (savedHistory) {
        const parsedHistory =
          JSON.parse(savedHistory);

        if (
          Array.isArray(parsedHistory)
        ) {
          setHistory(parsedHistory);
        }
      }
    } catch (error) {
      console.error(
        "Could not load conversation history:",
        error
      );
    }
  }, []);

  // ==================================================
  // SAVE HISTORY
  // ==================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
      );
    } catch (error) {
      console.error(
        "Could not save conversation history:",
        error
      );
    }
  }, [history]);

  // ==================================================
  // AUTH FORM RESET
  // ==================================================

  const resetAuthForm = () => {
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthError("");
    setShowPassword(false);
  };

  // ==================================================
  // SWITCH LOGIN / SIGNUP
  // ==================================================

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    resetAuthForm();
  };

  // ==================================================
  // GET USERS
  // ==================================================

  const getUsers = () => {
    try {
      const savedUsers =
        localStorage.getItem(
          USERS_KEY
        );

      if (!savedUsers) {
        return [];
      }

      const users =
        JSON.parse(savedUsers);

      return Array.isArray(users)
        ? users
        : [];
    } catch (error) {
      console.error(
        "Could not load users:",
        error
      );

      return [];
    }
  };

  // ==================================================
  // SAVE USERS
  // ==================================================

  const saveUsers = (users) => {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const handleLogin = (event) => {
    event.preventDefault();

    setAuthError("");

    const email =
      authEmail.trim().toLowerCase();

    const password =
      authPassword.trim();

    if (!email || !password) {
      setAuthError(
        "Please enter your email and password."
      );

      return;
    }

    setAuthLoading(true);

    setTimeout(() => {
      const users = getUsers();

      const user = users.find(
        (item) =>
          item.email === email &&
          item.password === password
      );

      if (!user) {
        setAuthError(
          "Invalid email or password. Please try again."
        );

        setAuthLoading(false);

        return;
      }

      const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        guest: false,
      };

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
      );

      setCurrentUser(session);
      setIsAuthenticated(true);

      resetAuthForm();

      setAuthLoading(false);
    }, 500);
  };

  // ==================================================
  // SIGN UP
  // ==================================================

  const handleSignUp = (event) => {
    event.preventDefault();

    setAuthError("");

    const name =
      authName.trim();

    const email =
      authEmail.trim().toLowerCase();

    const password =
      authPassword.trim();

    if (
      !name ||
      !email ||
      !password
    ) {
      setAuthError(
        "Please fill in all fields."
      );

      return;
    }

    if (password.length < 6) {
      setAuthError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    setAuthLoading(true);

    setTimeout(() => {
      const users = getUsers();

      const existingUser =
        users.find(
          (item) =>
            item.email === email
        );

      if (existingUser) {
        setAuthError(
          "An account with this email already exists."
        );

        setAuthLoading(false);

        return;
      }

      const newUser = {
        id:
          Date.now().toString(),

        name,
        email,
        password,
      };

      saveUsers([
        ...users,
        newUser,
      ]);

      const session = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        guest: false,
      };

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
      );

      setCurrentUser(session);
      setIsAuthenticated(true);

      resetAuthForm();

      setAuthLoading(false);
    }, 500);
  };

  // ==================================================
  // GUEST LOGIN
  // ==================================================

  const continueAsGuest = () => {
    const guestUser = {
      id: "guest",
      name: "Guest",
      email: "",
      guest: true,
    };

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(guestUser)
    );

    setCurrentUser(guestUser);
    setIsAuthenticated(true);

    resetAuthForm();
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const logout = () => {
    stopSpeaking();

    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore
    }

    localStorage.removeItem(
      SESSION_KEY
    );

    setCurrentUser(null);
    setIsAuthenticated(false);

    setShowChat(false);
    setShowHistory(false);

    setMessages([]);
    setMessage("");

    setIsListening(false);

    setAuthMode("login");

    resetAuthForm();
  };

  // ==================================================
  // OPEN CHAT
  // ==================================================

  const openChat = () => {
    setShowChat(true);
  };
  const exploreCategory = (category) => {
  setMessage(category.question);
  setMessages([]);
  setShowHistory(false);
  setShowChat(true);
};

  // ==================================================
  // SPEECH RECOGNITION
  // ==================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.lang =
      currentLanguage.speechCode;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore
      }
    };
  }, [
    currentLanguage.speechCode,
    isAuthenticated,
  ]);

  // ==================================================
  // MICROPHONE
  // ==================================================

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Voice input is not supported by this browser. Please use Google Chrome."
      );

      return;
    }

    if (isListening) {
      recognitionRef.current.stop();

      setIsListening(false);

      return;
    }

    try {
      recognitionRef.current.lang =
        currentLanguage.speechCode;

      recognitionRef.current.start();

      setIsListening(true);
    } catch (error) {
      console.error(
        "Microphone error:",
        error
      );
    }
  };

  // ==================================================
  // CLEAN AI TEXT FOR SPEECH
  // ==================================================

  const cleanTextForSpeech = (text) => {
    if (!text) {
      return "";
    }

    return text
      .replace(
        /\*\*(.*?)\*\*/g,
        "$1"
      )
      .replace(
        /__(.*?)__/g,
        "$1"
      )
      .replace(
        /^#{1,6}\s+/gm,
        ""
      )
      .replace(
        /^\s*[-*]\s+/gm,
        "• "
      )
      .replace(
        /`([^`]+)`/g,
        "$1"
      )
      .trim();
  };

  // ==================================================
  // TEXT TO SPEECH
  // ==================================================

  const speakText = (
    text,
    speechCode,
    messageIndex = null
  ) => {
    if (
      !("speechSynthesis" in window)
    ) {
      alert(
        "Voice output is not supported by this browser."
      );

      return;
    }

    const cleanText =
      cleanTextForSpeech(text);

    if (!cleanText) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        cleanText
      );

    utterance.lang = speechCode;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    if (messageIndex !== null) {
      setSpeakingIndex(
        messageIndex
      );

      utterance.onend = () => {
        setSpeakingIndex(null);
      };

      utterance.onerror = () => {
        setSpeakingIndex(null);
      };
    }

    window.speechSynthesis.speak(
      utterance
    );
  };

  // ==================================================
  // STOP SPEAKING
  // ==================================================

  const stopSpeaking = () => {
    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setSpeakingIndex(null);
  };

  // ==================================================
  // SAVE CONVERSATION
  // ==================================================

  const saveConversation = (
    conversation
  ) => {
    if (!conversation.length) {
      return;
    }

    const firstUserMessage =
      conversation.find(
        (item) =>
          item.role === "user"
      );

    if (!firstUserMessage) {
      return;
    }

    const title =
      firstUserMessage.text
        .trim()
        .slice(0, 70);

    const newConversation = {
      id:
        Date.now().toString(),

      title:
        title ||
        "BharatSahayak conversation",

      language,

      userId:
        currentUser?.id ||
        "guest",

      createdAt:
        new Date().toISOString(),

      messages:
        conversation,
    };

    setHistory((previous) => {
      return [
        newConversation,
        ...previous,
      ].slice(0, 30);
    });
  };

  // ==================================================
  // NEW CHAT
  // ==================================================

  const startNewChat = () => {
    stopSpeaking();

    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore
    }

    setMessages([]);
    setMessage("");
    setShowHistory(false);
    setIsListening(false);
  };

  // ==================================================
  // OPEN HISTORY
  // ==================================================

  const openHistoryConversation = (
    conversation
  ) => {
    stopSpeaking();

    setLanguage(
      conversation.language ||
        "English"
    );

    setMessages(
      Array.isArray(
        conversation.messages
      )
        ? conversation.messages
        : []
    );

    setMessage("");

    setShowHistory(false);
    setShowChat(true);
  };

  // ==================================================
  // DELETE HISTORY
  // ==================================================

  const deleteHistoryConversation = (
    id
  ) => {
    setHistory((previous) =>
      previous.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // ==================================================
  // SEND MESSAGE
  // ==================================================

  const sendMessage = async () => {
    const text =
      message.trim();

    if (
      !text ||
      loading
    ) {
      return;
    }

    const userMessage = {
      role: "user",
      text,
    };

    const messagesWithUser = [
      ...messages,
      userMessage,
    ];

    setMessages(
      messagesWithUser
    );

    setMessage("");
    setLoading(true);

    try {
       const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const response =
  await fetch(`${API_BASE_URL}/api/chat`, {
          
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message: text,
              language,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Backend request failed"
        );
      }

      const data =
        await response.json();

      const aiMessage = {
        role: "assistant",

        text:
          data.answer ||
          "Sorry, I could not generate an answer.",

        sources:
          Array.isArray(
            data.sources
          )
            ? data.sources
            : [],
      };

      const finalMessages = [
        ...messagesWithUser,
        aiMessage,
      ];

      setMessages(
        finalMessages
      );

      saveConversation(
        finalMessages
      );

      speakText(
        aiMessage.text,
        currentLanguage.speechCode
      );
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      setMessages(
        (previous) => [
          ...previous,

          {
            role: "assistant",

            text:
              "Sorry, I couldn't connect to BharatSahayak right now. Please make sure the backend server is running.",

            sources: [],
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (messageIndex, value) => {
  setFeedback((previous) => ({
    ...previous,
    [messageIndex]: value,
  }));
};

  // ==================================================
  // KEYBOARD
  // ==================================================

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  // ==================================================
  // LANGUAGE CHANGE
  // ==================================================

  const changeLanguage = (
    newLanguage
  ) => {
    setLanguage(
      newLanguage
    );

    setShowLanguages(false);

    stopSpeaking();

    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore
    }

    setIsListening(false);
  };

  // ==================================================
  // CLOSE CHAT
  // ==================================================

  const closeChat = () => {
    stopSpeaking();

    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore
    }

    setShowChat(false);
    setShowHistory(false);
    setIsListening(false);
  };
  // ==================================================
// SHARE CONVERSATION
// ==================================================

const shareConversation = async () => {
  if (!messages.length) {
    alert("There is no conversation to share yet.");
    return;
  }

  const shareText = messages
    .map((item) => {
      const speaker =
        item.role === "user"
          ? "You"
          : "BharatSahayak AI";

      return `${speaker}: ${item.text}`;
    })
    .join("\n\n");

  try {
    if (navigator.share) {
      await navigator.share({
        title: "BharatSahayak AI Conversation",
        text: shareText,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Conversation copied to clipboard.");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Share failed:", error);
    }
  }
};

  // ==================================================
  // AI MARKDOWN FORMATTER
  // ==================================================

  const renderFormattedText = (
    text
  ) => {
    if (!text) {
      return null;
    }

    const lines =
      text.split(/\r?\n/);

    return lines.map(
      (line, lineIndex) => {
        let formattedLine =
          line;

        // Remove Markdown headings
        formattedLine =
          formattedLine.replace(
            /^#{1,6}\s+/,
            ""
          );

        // Convert Markdown bullets
        formattedLine =
          formattedLine.replace(
            /^(\s*)[-*]\s+/,
            "$1• "
          );

        // Split bold Markdown
        const parts =
          formattedLine.split(
            /(\*\*.*?\*\*|__.*?__)/
          );

        return (
          <span
            key={lineIndex}
          >
            {parts.map(
              (
                part,
                partIndex
              ) => {
                const isBold =
                  (part.startsWith(
                    "**"
                  ) &&
                    part.endsWith(
                      "**"
                    )) ||
                  (part.startsWith(
                    "__"
                  ) &&
                    part.endsWith(
                      "__"
                    ));

                if (isBold) {
                  return (
                    <strong
                      key={
                        partIndex
                      }
                    >
                      {part.slice(
                        2,
                        -2
                      )}
                    </strong>
                  );
                }

                return (
                  <span
                    key={
                      partIndex
                    }
                  >
                    {part}
                  </span>
                );
              }
            )}

            {lineIndex <
              lines.length -
                1 && (
              <br />
            )}
          </span>
        );
      }
    );
  };

  // ==================================================
  // SOURCE RENDERER
  // ==================================================

  const renderSource = (
    source,
    index
  ) => {
    if (
      typeof source ===
      "string"
    ) {
      return (
        <a
          key={index}
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="source-item"
        >
          <ExternalLink
            size={14}
          />

          <span>
            {source}
          </span>
        </a>
      );
    }

    if (
      !source ||
      typeof source !==
        "object"
    ) {
      return null;
    }

    const title =
      source.title ||
      source.name ||
      source.label ||
      "Source";

    const url =
      source.url ||
      source.link ||
      source.href;

    if (!url) {
      return (
        <div
          key={index}
          className="source-item source-text-only"
        >
          <ShieldCheck
            size={14}
          />

          <span>
            {title}
          </span>
        </div>
      );
    }

    return (
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="source-item"
      >
        <ExternalLink
          size={14}
        />

        <span>
          {title}
        </span>
      </a>
    );
  };

  // ==================================================
  // CLEANUP
  // ==================================================

  useEffect(() => {
    return () => {
      if (
        "speechSynthesis" in
        window
      ) {
        window.speechSynthesis.cancel();
      }

      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore
      }
    };
  }, []);

  // ==================================================
  // LOGIN SCREEN
  // ==================================================

  if (!isAuthenticated) {
    return (
      <div className="auth-page">

        <div className="background-glow glow-one"></div>
        <div className="background-glow glow-two"></div>
        <div className="background-glow glow-three"></div>

        <div className="auth-card">

          {/* LOGO */}

          <div className="auth-logo">
            <Sparkles size={25} />
          </div>

          <div className="auth-brand">
            BharatSahayak
          </div>

          <div className="auth-tagline">
            Intelligence in your language.
          </div>

          {/* TITLE */}

          <div className="auth-heading">

            <h1>
              {authMode ===
              "login"
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p>
              {authMode ===
              "login"
                ? "Continue your journey with BharatSahayak AI."
                : "Join BharatSahayak and experience AI in your language."}
            </p>

          </div>

          {/* FORM */}

          <form
            className="auth-form"
            onSubmit={
              authMode ===
              "login"
                ? handleLogin
                : handleSignUp
            }
          >

            {/* NAME */}

            {authMode ===
              "signup" && (

              <div className="auth-field">

                <label>
                  Your name
                </label>

                <div className="auth-input-wrapper">

                  <User
                    size={18}
                  />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={
                      authName
                    }
                    onChange={(event) =>
                      setAuthName(
                        event.target
                          .value
                      )
                    }
                    autoComplete="name"
                  />

                </div>

              </div>

            )}

            {/* EMAIL */}

            <div className="auth-field">

              <label>
                Email address
              </label>

              <div className="auth-input-wrapper">

                <Mail
                  size={18}
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={
                    authEmail
                  }
                  onChange={(event) =>
                    setAuthEmail(
                      event.target
                        .value
                    )
                  }
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="auth-field">

              <label>
                Password
              </label>

              <div className="auth-input-wrapper">

                <Lock
                  size={18}
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={
                    authPassword
                  }
                  onChange={(event) =>
                    setAuthPassword(
                      event.target
                        .value
                    )
                  }
                  autoComplete={
                    authMode ===
                    "login"
                      ? "current-password"
                      : "new-password"
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff
                      size={17}
                    />
                  ) : (
                    <Eye
                      size={17}
                    />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {authError && (

              <div className="auth-error">
                {authError}
              </div>

            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit"
              disabled={
                authLoading
              }
            >

              {authLoading ? (

                <>
                  <LoaderCircle
                    size={18}
                    className="loading-icon"
                  />

                  Please wait...

                </>

              ) : (

                <>
                  {authMode ===
                  "login"
                    ? "Login"
                    : "Create Account"}

                  <ArrowRight
                    size={18}
                  />
                </>

              )}

            </button>

          </form>

          {/* SWITCH */}

          <div className="auth-switch">

            {authMode ===
            "login" ? (
              <>
                Don't have an account?

                <button
                  type="button"
                  onClick={() =>
                    switchAuthMode(
                      "signup"
                    )
                  }
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?

                <button
                  type="button"
                  onClick={() =>
                    switchAuthMode(
                      "login"
                    )
                  }
                >
                  Login
                </button>
              </>
            )}

          </div>

          {/* DIVIDER */}

          <div className="auth-divider">

            <span></span>

            <small>
              OR
            </small>

            <span></span>

          </div>

          {/* GUEST */}

          <button
            type="button"
            className="guest-button"
            onClick={
              continueAsGuest
            }
          >

            <UserPlus
              size={18}
            />

            Continue as Guest

          </button>

          <div className="auth-security">

            <ShieldCheck
              size={14}
            />

            Your account stays on
            this device in this demo.

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // MAIN APPLICATION
  // ==================================================

  return (
    <div className="app">

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>
      <div className="background-glow glow-three"></div>

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <Sparkles size={20} />
          </div>

          <div>

            <div className="brand-name">
              BharatSahayak
            </div>

            <div className="brand-subtitle">
              AI for Bharat
            </div>

          </div>

        </div>

        <div className="nav-right">

          {/* LANGUAGE */}

          <div className="language-wrapper">

            <button
              className="language-button"
              onClick={() =>
                setShowLanguages(
                  !showLanguages
                )
              }
            >

              <Globe2 size={17} />

              <span>
                {language}
              </span>

              <ChevronDown
                size={15}
              />

            </button>

            {showLanguages && (
              <div className="language-menu">

                {LANGUAGES.map(
                  (item) => (
                    <button
                      key={
                        item.name
                      }
                      onClick={() =>
                        changeLanguage(
                          item.name
                        )
                      }
                    >

                      <span>
                        {item.native}
                      </span>

                      <small>
                        {item.name}
                      </small>

                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* USER */}

          <div className="user-menu">

            <div className="user-badge">

              <User size={15} />

              <span>
                {currentUser?.name ||
                  "User"}
              </span>

            </div>

            <button
              className="logout-button"
              onClick={
                logout
              }
              title="Logout"
            >

              <LogOut
                size={16}
              />

            </button>

          </div>

          {/* CHAT */}

          <button
            className="nav-chat"
            onClick={
              openChat
            }
          >

            <MessageCircle
              size={17}
            />

            Chat

          </button>

        </div>

      </nav>

      {/* ==================================================
          HERO
      ================================================== */}

      <main className="hero">

        <div className="hero-badge">

          <span className="status-dot"></span>

          Welcome,{" "}
          {currentUser?.name ||
            "Guest"}

          <span className="badge-line"></span>

          3 languages

        </div>

        <h1>

          Intelligence
          <br />

          <span>
            in your language.
          </span>

        </h1>

        <p className="hero-description">

          Ask naturally.
          Understand easily.
          <br />

          BharatSahayak brings
          helpful AI closer to
          every Indian.

        </p>

        <div className="ai-orb-container">

          <div className="orb-ring ring-one"></div>
          <div className="orb-ring ring-two"></div>
          <div className="orb-ring ring-three"></div>

          <div className="ai-orb">

            <div className="orb-inner">
              <Sparkles size={34} />
            </div>

          </div>

          <div className="floating-language lang-one">
            ಕನ್ನಡ
          </div>

          <div className="floating-language lang-two">
            हिन्दी
          </div>

          <div className="floating-language lang-three">
            English
          </div>

        </div>

        <div className="hero-actions">

          <button
            className="primary-button"
            onClick={() => {
              openChat();

              setTimeout(
                () => {
                  toggleListening();
                },
                300
              );
            }}
          >

            <Mic size={20} />

            Start Speaking

            <ArrowRight
              size={18}
            />

          </button>

          <button
            className="secondary-button"
            onClick={
              openChat
            }
          >

            <MessageCircle
              size={19}
            />

            Start Chatting

          </button>

        </div>

        <p className="voice-note">

          <Volume2 size={15} />

          Voice conversations
          in Indian languages

        </p>

      </main>

      {/* ==================================================
          FEATURES
      ================================================== */}

      <section className="features">

        {/* ==================================================
    EXPLORE BHARAT
================================================== */}

<section className="explore-section">

  <div className="explore-heading">

    <div className="explore-badge">
      <Globe2 size={15} />
      Explore Bharat
    </div>

    <h2>
      What would you like
      <span> to explore?</span>
    </h2>

    <p>
      Choose a topic and start a conversation
      with BharatSahayak.
    </p>

  </div>

  <div className="explore-grid">

    {EXPLORE_CATEGORIES.map((category) => (

      <button
        key={category.title}
        className="explore-card"
        onClick={() => exploreCategory(category)}
      >

        <div className="explore-icon">
          {category.icon}
        </div>

        <div className="explore-content">

          <h3>
            {category.title}
          </h3>

          <p>
            {category.description}
          </p>

        </div>

        <ArrowRight
          size={17}
          className="explore-arrow"
        />

      </button>

    ))}

  </div>

</section>

        <div className="feature-card">

          <div className="feature-icon">
            <Mic size={21} />
          </div>

          <div>

            <h3>
              Voice AI
            </h3>

            <p>
              Speak naturally
              instead of typing.
            </p>

          </div>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            <Globe2 size={21} />
          </div>

          <div>

            <h3>
              Indian Languages
            </h3>

            <p>
              Kannada, Hindi
              and English to start.
            </p>

          </div>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            <ShieldCheck
              size={21}
            />
          </div>

          <div>

            <h3>
              Trusted Information
            </h3>

            <p>
              Answers designed
              around reliable sources.
            </p>

          </div>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            <MessageCircle
              size={21}
            />
          </div>

          <div>

            <h3>
              Natural Conversation
            </h3>

            <p>
              Ask follow-up
              questions naturally.
            </p>

          </div>

        </div>

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <div>
          ©️ 2026 BharatSahayak AI
        </div>

        <div className="footer-center">

          <span className="india-dot"></span>

          Made for India

        </div>

        <div>
          AI • Voice • Languages
        </div>

      </footer>

      {/* ==================================================
          CHAT
      ================================================== */}

      {showChat && (

        <div className="chat-overlay">

          <div className="chat-window">

            {/* ==================================================
                CHAT HEADER
            ================================================== */}

            <div className="chat-header">

              <div className="chat-title">

                <div className="chat-avatar">
                  <Sparkles
                    size={19}
                  />
                </div>

                <div>

                  <h2>
                    BharatSahayak
                  </h2>

                  <span>

                    <span className="online-dot"></span>

                    AI Assistant •{" "}
                    {language}

                  </span>

                </div>

              </div>

              <div className="chat-header-actions">

                {/* NEW CHAT */}

                <button
                  className="header-action-button"
                  onClick={
                    startNewChat
                  }
                  title="New chat"
                >
                  <Plus
                    size={18}
                  />
                </button>

                {/* HISTORY */}

                <button
                  className="header-action-button"
                  onClick={() =>
                    setShowHistory(
                      !showHistory
                    )
                  }
                  title="Conversation history"
                >
                  <History
                    size={18}
                  />
                </button>

                {/* CLOSE */}

                <button
                  className="chat-close"
                  onClick={
                    closeChat
                  }
                >
                  <X size={21} />
                </button>
                <button
  className="header-action-button"
  onClick={shareConversation}
  title="Share conversation"
>
  <Share2 size={18} />
</button>

              </div>

            </div>

            {/* ==================================================
                HISTORY
            ================================================== */}

            {showHistory ? (

              <div className="history-panel">

                <div className="history-title">

                  <div>

                    <History
                      size={18}
                    />

                    <span>
                      Conversation History
                    </span>

                  </div>

                  <button
                    className="secondary-small-button"
                    onClick={
                      startNewChat
                    }
                  >

                    <Plus
                      size={15}
                    />

                    New chat

                  </button>

                </div>

                {history.filter(
                  (item) =>
                    !item.userId ||
                    item.userId ===
                      currentUser?.id
                ).length ===
                0 ? (

                  <div className="history-empty">

                    <History
                      size={32}
                    />

                    <h3>
                      No conversations yet
                    </h3>

                    <p>
                      Your conversations
                      will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="history-list">

                    {history
                      .filter(
                        (item) =>
                          !item.userId ||
                          item.userId ===
                            currentUser?.id
                      )
                      .map(
                        (
                          conversation
                        ) => (

                          <div
                            className="history-item"
                            key={
                              conversation.id
                            }
                          >

                            <button
                              className="history-open"
                              onClick={() =>
                                openHistoryConversation(
                                  conversation
                                )
                              }
                            >

                              <strong>
                                {
                                  conversation.title
                                }
                              </strong>

                              <span>

                                {
                                  conversation.language
                                }

                                {" • "}

                                {new Date(
                                  conversation.createdAt
                                ).toLocaleDateString()}

                              </span>

                            </button>

                            <button
                              className="history-delete"
                              onClick={() =>
                                deleteHistoryConversation(
                                  conversation.id
                                )
                              }
                              title="Delete conversation"
                            >

                              <Trash2
                                size={16}
                              />

                            </button>

                          </div>

                        )
                      )}

                  </div>

                )}

              </div>

            ) : (

              <>

                {/* ==================================================
                    MESSAGES
                ================================================== */}

                <div className="chat-messages">

                  {messages.length ===
                    0 && (

                    <div className="chat-welcome">

                      <div className="welcome-orb">
                        <Sparkles
                          size={28}
                        />
                      </div>

                      <h3>
                        Namaste! 🙏
                      </h3>

                      <p>

                        I am
                        BharatSahayak.
                        Ask me anything
                        in{" "}

                        <strong>
                          {language}
                        </strong>.

                      </p>

                      <div className="suggestion-buttons">

                        <button
                          onClick={() =>
                            setMessage(
                              language ===
                                "Kannada"
                                ? "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಎಂದರೇನು?"
                                : language ===
                                    "Hindi"
                                  ? "कृत्रिम बुद्धिमत्ता क्या है?"
                                  : "What is Artificial Intelligence?"
                            )
                          }
                        >
                          What is AI?
                        </button>

                        <button
                          onClick={() =>
                            setMessage(
                              language ===
                                "Kannada"
                                ? "ಕರ್ನಾಟಕದ ಬಗ್ಗೆ ಹೇಳಿ"
                                : language ===
                                    "Hindi"
                                  ? "कर्नाटक के बारे में बताइए"
                                  : "Tell me about Karnataka"
                            )
                          }
                        >
                          About Karnataka
                        </button>

                      </div>

                    </div>

                  )}

                  {messages.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={index}
                        className={`message-row ${
                          item.role ===
                          "user"
                            ? "user-row"
                            : "ai-row"
                        }`}
                      >

                        {item.role ===
                          "assistant" && (

                          <div className="small-ai-avatar">

                            <Sparkles
                              size={14}
                            />

                          </div>

                        )}

                        <div
                          className={`message-bubble ${
                            item.role ===
                            "user"
                              ? "user-message"
                              : "ai-message"
                          }`}
                        >

                          {/* ==================================================
                              FORMATTED MESSAGE
                          ================================================== */}

                          <div className="message-text">

                            {item.role ===
                            "assistant"
                              ? renderFormattedText(
                                  item.text
                                )
                              : item.text}

                          </div>

                          {/* ==================================================
                              VOICE BUTTON
                          ================================================== */}

                          {item.role ===
                            "assistant" && (

                            <button
                              className="message-voice-button"
                              onClick={() => {

                                if (
                                  speakingIndex ===
                                  index
                                ) {

                                  stopSpeaking();

                                } else {

                                  speakText(
                                    item.text,
                                    currentLanguage.speechCode,
                                    index
                                  );

                                }

                              }}
                              title={
                                speakingIndex ===
                                index
                                  ? "Stop speaking"
                                  : "Read aloud"
                              }
                            >

                              {speakingIndex ===
                              index ? (
                                <VolumeX
                                  size={16}
                                />
                              ) : (
                                <Volume2
                                  size={16}
                                />
                              )}

                            </button>

                          )}

                          <div className="feedback-actions">

  <span className="feedback-label">
    Was this helpful?
  </span>

  <button
    className={`feedback-button ${
      feedback[index] === "up"
        ? "feedback-selected"
        : ""
    }`}
    onClick={() =>
      handleFeedback(index, "up")
    }
    title="Helpful"
  >
    <ThumbsUp size={14} />
  </button>

  <button
    className={`feedback-button ${
      feedback[index] === "down"
        ? "feedback-selected"
        : ""
    }`}
    onClick={() =>
      handleFeedback(index, "down")
    }
    title="Not helpful"
  >
    <ThumbsDown size={14} />
  </button>

</div>

                          {/* ==================================================
                              SOURCES
                          ================================================== */}

                          {item.role ===
                            "assistant" &&
                            Array.isArray(
                              item.sources
                            ) &&
                            item.sources
                              .length >
                              0 && (

                              <div className="sources-section">

                                <div className="sources-header">

                                  <ShieldCheck
                                    size={15}
                                  />

                                  <span>
                                    Sources
                                  </span>

                                </div>

                                <div className="sources-list">

                                  {item.sources.map(
                                    (
                                      source,
                                      sourceIndex
                                    ) =>
                                      renderSource(
                                        source,
                                        sourceIndex
                                      )
                                  )}

                                </div>

                              </div>

                            )}

                        </div>

                      </div>

                    )
                  )}

                  {/* ==================================================
                      LOADING
                  ================================================== */}

                  {loading && (

                    <div className="message-row ai-row">

                      <div className="small-ai-avatar">

                        <Sparkles
                          size={14}
                        />

                      </div>

                      <div className="ai-message typing-message">

                        <LoaderCircle
                          className="loading-icon"
                          size={17}
                        />

                        Thinking...

                      </div>

                    </div>

                  )}

                </div>

                {/* ==================================================
                    INPUT
                ================================================== */}

                <div className="chat-input-area">

                  <div className="chat-input-box">

                    <button
                      className={`microphone-button ${
                        isListening
                          ? "microphone-active"
                          : ""
                      }`}
                      onClick={
                        toggleListening
                      }
                    >

                      <Mic size={19} />

                      {isListening && (
                        <span className="listening-pulse"></span>
                      )}

                    </button>

                    <textarea
                      value={message}
                      onChange={(
                        event
                      ) =>
                        setMessage(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder={`Ask BharatSahayak in ${language}...`}
                      rows="1"
                    />

                    <button
                      className="send-button"
                      onClick={
                        sendMessage
                      }
                      disabled={
                        !message.trim() ||
                        loading
                      }
                    >

                      <Send
                        size={18}
                      />

                    </button>

                  </div>

                  {isListening && (

                    <div className="listening-status">

                      <span className="recording-dot"></span>

                      Listening in{" "}
                      {language}...
                      Speak now

                    </div>

                  )}

                  <div className="chat-input-note">
                    <div className="trust-notice">

  <ShieldCheck size={14} />

  <div>
    <strong>Trust & Safety</strong>

    <span>
      AI-generated information may need verification.
      For important decisions, check official sources.
    </span>
  </div>

</div>

                    BharatSahayak AI •
                    Responses may need
                    verification

                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;