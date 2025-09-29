Architecting Intelligent Agents on the Zalo Platform: A Comprehensive Technical Analysis
Section 1: Deconstructing the Zalo API Ecosystem
An intelligent agent's efficacy is contingent upon its ability to navigate and interact with its host environment. The Zalo platform, while powerful, presents a fragmented and multifaceted ecosystem that demands a clear architectural map before any development of sophisticated agents can commence. The primary challenge for architects and developers is the absence of a single, unified documentation portal, with critical information distributed across multiple domains. This section provides a synthesized, unified view of this landscape, clarifying the distinct platforms and establishing the foundational client-side versus server-side architectural dichotomy that governs all agent development on Zalo.

1.1 A Unified View of a Fragmented Landscape
To build a context-aware agent, a developer must draw upon resources from several distinct yet interconnected Zalo platforms. Each platform serves a specific purpose, and understanding their individual roles and how they interoperate is the first step in designing a coherent system architecture.

Zalo Mini App Platform (mini.zalo.me): This is the core runtime environment for any user-facing component of an agent. It provides the client-side Zalo Mini App SDK (ZMP SDK), a comprehensive JavaScript library that enables the agent's front-end to interact directly with the Zalo native application on a user's device. This is the exclusive gateway to device hardware (camera, location services, NFC), native UI elements (toasts, navigation bars), and user-specific context that requires direct interaction and consent. The agent's "senses" and "limbs" are primarily defined by the capabilities of this SDK.

ZaloPay Platform (docs.zalopay.vn): This platform is the authoritative domain for all transactional functionalities. It is a dual-faceted system, offering both a client-side MiniApp SDK for embedding payment flows directly within the user interface and a separate, more extensive set of server-side OpenAPIs. These OpenAPIs are essential for the agent's backend to securely manage the entire financial lifecycle, including creating orders, processing refunds, managing disbursements, and handling merchant onboarding. Any agent tasked with commercial or financial operations will rely heavily on this platform.

Zalo AI Platform (ai.zalo.cloud): This platform extends the potential intelligence of an agent by offering a suite of proprietary AI services. These services, such as Text-to-Speech (TTS), are accessible via server-side API calls, authenticated using a distinct apikey. While the provided documentation offers limited detail on the full range of services, the platform's existence signifies a strategic opportunity to enhance an agent with officially supported, deeply integrated AI capabilities, creating a powerful synergy between the agent's logic and Zalo's own machine learning infrastructure.

Official Account (OA) & General Developer Platform (developers.zalo.me): This domain serves as the administrative and strategic hub for developers. It is where developers register their applications to receive a Zalo App ID, manage permissions, and access the powerful Official Account (OA) APIs. The OA is a critical channel for an agent's proactive and asynchronous communication strategy, enabling it to send notifications, transactional updates, and engage with users outside the immediate context of the Mini App session.

1.2 The Client-Side vs. Server-Side Dichotomy
The Zalo platform enforces a strict separation between client-side operations, which occur within the Mini App on the user's device, and server-side operations, which are executed by the developer's backend infrastructure. This separation is not merely a recommendation but a fundamental architectural constraint that dictates the design of any secure and scalable agent.

Client-Side Operations (ZMP SDK): The APIs documented at mini.zalo.me and the payment-specific functions in the ZaloPay MiniApp SDK are invoked via JavaScript within the Mini App's sandboxed webview environment. Their primary function is to serve as a bridge to the native Zalo application and the underlying device hardware. This is the only way to access device-native features like 

getLocation, scanQRCode, and vibrate, or to request user-specific information that requires an interactive, real-time consent prompt, such as getUserInfo or getPhoneNumber.

Server-Side Operations (Open APIs): These are standard RESTful APIs intended for secure backend-to-backend communication. This category includes the ZaloPay OpenAPIs for payment processing , the Zalo AI APIs , and the management APIs available to Solution Partners for programmatic app creation and deployment. These APIs are indispensable for executing business logic, processing sensitive data, integrating with third-party systems or databases, and performing secure operations that must never be exposed on the client. The emergence of unofficial libraries like the Python wrapper 

zlapi further underscores the necessity and demand for robust server-side automation and interaction capabilities.

This client-server division necessitates a hybrid architecture for any non-trivial agent. An agent's design cannot be monolithic; it must consist of at least two distinct components. The client-side Mini App acts as the agent's sensory-motor system, gathering local context and executing actions that require user interaction. The server-side application, in turn, functions as the agent's central nervous system or "brain," housing the core logic, performing complex computations, ensuring data persistence, and securely interfacing with both Zalo's backend services and the developer's own infrastructure. The official Coffee Shop tutorial, with its distinct client and server-api modules, serves as a canonical example of this mandatory hybrid model.

Furthermore, the Zalo App ID emerges as the lynchpin of this entire ecosystem. It is the central unit of identity and trust that connects a developer's assets across the fragmented platforms. The user identifiers returned by APIs like 

getUserInfo are explicitly scoped to this App ID, meaning a user has a different ID for each Zalo application they interact with. This design choice makes the Zalo App ID the root of trust and the fundamental namespace for all user data, permissions, and context within a developer's domain. Consequently, an agent's entire operational scope is inextricably bound to its Zalo App ID, and any strategy involving multiple distinct agents would require the careful management of multiple Zalo App IDs, each with its own siloed user data and permission sets.

Section 2: Foundational Capabilities for Agent Context-Awareness
An intelligent agent's ability to act meaningfully is predicated on its capacity to perceive and understand its environment. The Zalo API ecosystem provides a rich set of tools that function as the agent's "senses," allowing it to build a comprehensive model of the user, the device, and the history of their interactions. Mastering these foundational APIs is essential for creating agents that are not merely reactive but genuinely context-aware.

2.1 User Identity and Profile APIs
Understanding the user is the bedrock of personalization and effective agent design. Zalo provides a tiered set of APIs to establish and enrich the user's identity.

Core Identity APIs: The primary instruments for user identification are getUserInfo, getUserID, and getPhoneNumber.

Deep Dive into getUserInfo: This is the most comprehensive endpoint for user profile data. The UserInfo data model it returns is exceptionally rich for building context. Beyond basic identifiers like 

id, name, and avatar, it includes crucial social and relational data points. The boolean followedOA indicates whether the user has followed the Mini App's linked Official Account, providing a key signal of user engagement. The idByOA field provides the user's specific identifier within the OA's context, which is essential for mapping the Mini App user to an OA follower for messaging purposes. Additionally, the isSensitive flag serves as a critical compliance signal, alerting the agent that the user may belong to a protected group requiring special data handling under local regulations.

The getPhoneNumber Security Flow: This API exemplifies Zalo's security-first approach to sensitive data. A client-side call to getPhoneNumber does not directly return the user's phone number. Instead, it returns a single-use, short-lived token after the user grants consent. This token must be passed to the agent's secure backend. The backend service then makes a server-to-server API call to Zalo, exchanging this 

token, the user's access_token, and the application's secret_key for the actual phone number. This two-step, server-mediated flow ensures that the user's phone number is never exposed in the client-side environment, mitigating the risk of data leakage.

Evolving Permission Model: Access to user data is governed by a nuanced and evolving permission model. A significant change was introduced with ZMP SDK version 2.35.0. The 

getAccessToken call, which is fundamental for authentication, is now granted automatically without a user prompt. However, this default token is restricted and only sufficient to retrieve the user's id. To access personally identifiable information (PII) such as the user's name and avatar, the agent must make a separate, explicit call to the authorize API with the scope.userInfo permission. Alternatively, the 

getUserInfo function can be called with the autoRequestPermission: true parameter, which will trigger the necessary consent dialog. This tiered permission system is a critical consideration for the agent's onboarding flow, requiring a strategy that requests elevated permissions only when necessary, thereby building user trust.

2.2 Environmental and Device Context
To be truly effective, an agent must be aware not only of the user but also of their physical and digital environment. The ZMP SDK provides a suite of APIs for gathering this situational context.

Location Services: The getLocation API allows the agent, with user consent, to retrieve the device's current geographical coordinates. This is fundamental for enabling a wide range of location-based services, from local search and recommendations to logistics and delivery tracking.

System and Device Information: The getSystemInfo and getDeviceIdAsync APIs provide a snapshot of the user's technical environment. This includes the device model, operating system, screen dimensions, and a unique device identifier. An agent can leverage this data to tailor its user interface for optimal display on different screen sizes or to enable device-specific features.

Network Awareness: The getNetworkType API and the onNetworkStatusChange event listener equip the agent with real-time knowledge of the user's connectivity status (e.g., WiFi, 4G, offline). This is crucial for performance optimization. A network-aware agent can make intelligent decisions about its behavior, such as deferring the download of large assets on a slow mobile connection or pre-caching data when on a stable WiFi network to ensure a smooth offline experience.

2.3 State Persistence and Knowledge Management (Native Storage)
For an agent to provide a continuous and coherent experience, it needs a form of memory. Zalo's Native Storage provides a client-side mechanism for this purpose.

Storage Mechanism: The platform offers a simple, synchronous key-value storage system accessible via the nativeStorage module. The modern API set consists of 

setItem, getItem, removeItem, clear, and getStorageInfo. It is important to note that an older set of asynchronous APIs (setStorage, getStorage) are now deprecated and should be avoided in new development.

Core Operations: The setItem and getItem functions are the primary methods for an agent to store and retrieve information across user sessions. As it is a string-based storage, complex objects or arrays must be serialized, typically using JSON.stringify, before being stored with setItem. Conversely, retrieved data must be deserialized with JSON.parse. The documentation strongly advises wrapping JSON.parse calls in try/catch blocks to gracefully handle cases where data is missing or corrupted, preventing potential application crashes.

Application for Agents: This client-side storage serves as the agent's short-term, high-speed memory. It is ideal for caching user preferences, storing recent search queries, maintaining the state of a shopping cart, or tracking progress through a multi-step workflow. The code examples provided in the Zalo Mini App blog offer a clear and practical implementation pattern for all essential storage operations.

Managing Storage Constraints: Native Storage is a finite resource. The documentation for the deprecated setStorage API notes that if the memory limit is reached, the oldest data will be deleted, implying a Least Recently Used (LRU) eviction policy. The 

getStorageInfo API allows a well-behaved agent to be aware of these constraints by returning the currentSize and limitSize of the storage in kilobytes. An agent should monitor its storage usage to avoid unexpected data loss and to implement intelligent caching strategies. This confirms that Native Storage should be treated as a performance-enhancing cache, not as a durable, permanent database. Critical information, such as completed transactions or core user profile data, must be synchronized with the agent's backend server to ensure persistence.

The following table provides a consolidated matrix of these foundational APIs, mapping their function to the specific contextual knowledge they provide for an agent.

Table 2.1: Context-Awareness API Matrix

Section 3: Core Action and Interaction APIs
An agent's value is realized through its ability to act upon the context it has gathered. The Zalo platform provides a rich vocabulary of action-oriented APIs that serve as the agent's "hands and voice." These tools enable the agent to engage in conversations, interact with the Zalo social graph, and execute complex transactions, transforming it from a passive data processor into an active participant in the user's digital journey.

3.1 Conversational and Notification Interfaces
Effective communication is central to any intelligent agent. Zalo offers several distinct channels for an agent to interact with users, each suited for different purposes.

Direct, User-Initiated Interaction (openChat): This API is a powerful tool for initiating a one-on-one conversation, either with the user directly or with a designated Official Account. Its most significant feature for an agent is the 

message parameter, which allows the agent to pre-fill the chat input box with a contextually relevant message. For example, an e-commerce agent could prompt, "I see you're looking at the new running shoes. Would you like to know more about their features?" This capability allows the agent to seamlessly transition the user from a browsing context to a conversational one. Importantly, the user retains full control and must explicitly tap "send" to dispatch the pre-filled message, a design choice that respects user autonomy and prevents spam.

Proactive, Asynchronous Notifications (requestSendNotification): This API is the gateway for an agent to earn the privilege of sending proactive messages. Calling this function triggers a native Zalo consent prompt, asking the user for permission to receive notifications from the Mini App's associated Official Account (OA). Once this one-time permission is granted, the agent's backend is authorized to use the OA APIs to send transactional or customer service messages via the Zalo Notification Service (ZNS). This channel is essential for any asynchronous communication, such as order status updates, appointment reminders, or alerts that need to reach the user even when they are not actively using the Mini App.

Rich Content and Viral Sharing (openShareSheet): This is one of the most versatile APIs for agent-driven actions, providing a bridge to Zalo's native social fabric. Invoking this function opens the standard Zalo sharing interface, which the agent can pre-populate with a wide variety of content types. The API supports sharing simple 

text, image URLs, and external links. More powerfully for ecosystem growth, it supports sharing a deep link directly back to a specific page within the Mini App itself, using the zmp or zmp_deep_link types. This allows an agent to facilitate viral loops, for instance, by prompting a user who has just achieved a milestone to "Share your result with friends!" The detailed data models available for each share type provide immense flexibility for crafting compelling, shareable content.

3.2 Social Graph and Engagement APIs
Zalo is fundamentally a social platform, and effective agents must be able to leverage its social graph to create more engaging and connected experiences.

Viewing Profiles (openProfile): This API provides a simple but effective way for an agent to direct the user's attention to another entity within the Zalo ecosystem. It can be used to open the profile of another Zalo user or an Official Account. This could be used to facilitate connections between users or to provide more detailed information about a business or partner OA.

Friend Selection (openProfilePicker): This API offers a deeper level of social integration. It opens a native UI that allows the user to select one or more friends from their contact list, up to a specified maxProfile limit. Upon selection, the API returns an array of 

PickedProfile objects to the agent, containing each selected friend's unique id, name, and avatar URL. This is a powerful primitive for building a wide range of social features. An agent could use it to implement functionality for inviting friends to an event, sharing a shopping cart with a specific person for collaborative purchasing, or creating small, private groups within the Mini App's context.

Official Account (OA) Integration: The relationship between the Mini App and its associated OA is a cornerstone of the Zalo ecosystem. The APIs followOA and unfollowOA allow an agent to directly prompt a user to manage this relationship from within the Mini App. The 

interactOA API provides another mechanism for triggering specific interactions with the OA. These tools enable the agent to create a seamless and integrated experience, blurring the lines between the interactive Mini App and the business's primary communication and retention channel on Zalo.

3.3 Transactional Capabilities: Payments and Verification
For agents operating in commercial, financial, or other high-trust domains, Zalo provides robust APIs for handling payments and verifying user identity.

Payment Orchestration (ZaloPay): The payment flow is orchestrated through the ZaloPay Checkout SDK, with the createOrder API being the central client-side function. The process is secure and involves close coordination between the agent's client and backend. First, the agent's backend creates an order in its own system and generates a secure Message Authentication Code (

mac) using its private key and the order data. This information is passed to the client, which then calls createOrder. This action redirects the user to the native ZaloPay payment interface to securely complete the transaction. The agent must then handle the payment result, which is delivered via a server-side callback and can also be queried proactively from the client using a checkTransaction API.

Identity Verification (eKYC): For services that require stringent identity verification, Zalo offers a comprehensive, multi-step eKYC (Electronic Know Your Customer) API suite. This is an entirely server-side workflow that an agent's backend must orchestrate. The process typically involves generating a unique session ID, instructing the user (via the Mini App UI) to upload images of their identity documents, and then polling a series of endpoints to retrieve the results of various automated checks, including Optical Character Recognition (OCR) on the ID card, Face Matching between the ID photo and a user selfie, and Fraud Checking against known databases. An agent designed for financial services, government interactions, or other regulated industries would need to implement this entire complex workflow to comply with legal requirements.

The design of these action-oriented APIs reveals a core principle of the Zalo platform: user control. An agent on Zalo cannot act with full autonomy. Nearly every significant action—sending a message with openChat, sharing content via openShareSheet, or authorizing a payment with createOrder—requires the user to perform the final, decisive tap. The agent's role is not that of an autonomous executor but rather a "smart concierge." Its intelligence is demonstrated by preparing and contextualizing actions, making it as simple as possible for the user to understand the proposed action and grant consent. The agent's success hinges on what it suggests and when, not on its ability to act unilaterally.

Section 4: Authentication, Governance, and Security
Developing a robust and compliant agent on a third-party platform necessitates a profound understanding of its governance framework, including its security models, operational constraints, and review processes. This section provides a detailed analysis of the Zalo platform's governance layer, covering the authentication and authorization flow, critical platform policies and limitations, and the submission and review process that every Mini App must navigate before release.

4.1 The Access Token and Authorization Flow
Authentication is the cornerstone of secure agent-user interaction, establishing a trusted identity for every API call.

The getAccessToken API: This function is the primary mechanism for authenticating a user within the Mini App. It returns an 

accessToken, a JSON Web Token (JWT), which encapsulates the user's identity in the specific context of that Zalo App. This token is the essential credential that the Mini App client must send to the agent's backend with every request, allowing the backend to securely identify the user.

The Post-SDK v2.35.0 Policy Shift: A critical evolution in the platform's privacy model occurred with SDK version 2.35.0. Prior to this update, any call to 

getAccessToken would trigger a user consent prompt. The current implementation, however, automatically returns a token without user interaction. This change streamlines the initial user experience but comes with a significant restriction: this default, consent-less token is a low-privilege credential. It is only sufficient for the backend to retrieve the user's unique, app-scoped 

userID.

Explicit Authorization for Elevated Permissions: To access more sensitive, personally identifiable information (PII) such as the user's name and profile picture, the agent must explicitly request elevated permissions. This is achieved by calling the authorize API with the appropriate scope, such as authorize({ scope: 'scope.userInfo' }). This action presents the user with a native consent dialog. This creates a clear, two-tiered permission system that an agent's logic must navigate: a default, low-privilege state for basic identification and an elevated, user-consented state for personalized interactions.

Backend Token Validation: It is imperative that the agent's backend does not blindly trust the accessToken received from the client. The backend should use Zalo's server-side APIs to validate the token's signature and retrieve the authoritative user profile associated with it. This server-to-server validation step is crucial to ensure the token is authentic and has not been tampered with, protecting against impersonation attacks.

4.2 Platform Policies and Constraints
An agent must operate within a strict set of rules and limitations imposed by the Zalo platform to ensure stability, fairness, and security for all users.

API Rate Limits and Throttling: The ZaloPay API documentation explicitly defines a rate-limiting mechanism. When an application exceeds its allotted request quota, the API will respond with an HTTP status code 429 Too Many Requests and a specific error payload containing code: -429 and short description: LIMIT_REQUEST_REACH. This error is documented for high-frequency operations such as creating orders, querying order status, and processing refunds. The prescribed mitigation strategy is to "recreate the request after a certain period of time," which indicates a time-window-based throttling policy (e.g., requests per minute). A resilient agent must be designed to handle this 

429 response gracefully, typically by implementing an exponential backoff-and-retry strategy.

User-Centric Interaction Limits: In addition to server-side rate limits, the platform also enforces limits on user-facing interactions to prevent developer abuse and user annoyance. For instance, the getPhoneNumber API has a hard limit of three rejections by a user within a single session. After the third denial, the API will fail automatically without prompting the user again. This forces the agent to be judicious in its requests for sensitive permissions.

Comprehensive Error Handling: The platform provides a detailed list of error codes that can be returned by the SDK and APIs. A production-grade agent must implement robust error handling to manage these scenarios. This includes not only technical errors like rate limiting but also user-driven events, such as the 

-2003 User cancel error returned when a user dismisses the openProfilePicker UI. The recommended practice for handling these promise-based API calls is to use modern JavaScript 

async/await syntax within try/catch blocks for clear and linear error management.

Data Privacy and Content Policies: All development must adhere to Zalo's comprehensive legal and content policies. The platform's privacy policy dictates that developers must obtain explicit user consent before accessing sensitive data like phone contacts or location. The Zalo Mini App Censorship Policy is even more prescriptive, outlining strict rules for application content, naming, and branding. Mini Apps are forbidden from using misleading logos or names, promoting illegal content, or functioning primarily as a means to redirect users to an external, standalone application. These policies are designed to protect users and maintain the integrity of the Zalo ecosystem.

4.3 The Submission and Review Gauntlet
Before an agent can be made available to the public, its encapsulating Mini App must pass a rigorous review process.

The Development and Submission Lifecycle: The standard workflow follows a clear, multi-stage path: local development and previewing, deploying a "Testing" version to the Zalo platform, submitting that version for formal review, and finally, upon approval, releasing it to the public. The formal review process is stated to take up to 72 working hours.

Strict Review Criteria: The review process is not a mere technical check for bugs; it is a comprehensive functional and policy compliance audit. Key criteria include:

Brand and Content Consistency: The Mini App's name, logo, and description must be consistent, accurately reflect its functionality, and not infringe on any third-party trademarks.

User Experience (UX) and Performance: The application must provide a clean, intuitive user interface and a smooth experience. It must be free of crashes and must meet Zalo's standards for performance and load times.

Justification of API Usage: Developers must request permission to use sensitive APIs, and these requests will only be approved if the Mini App demonstrates a clear, legitimate, and user-facing purpose for that access.

Authentication Standards: The Mini App must use the official Zalo Profile for all user login and account linking functionalities.

Special Considerations and Workarounds:

Regulated Industries: Mini Apps operating in specialized or regulated fields such as pharmaceuticals, cosmetics, finance, or government services are subject to a higher level of scrutiny. They must undergo an additional verification process that requires the submission of legal documents, business licenses, and other relevant certifications.

The Payment Integration Paradox: A common procedural hurdle arises from the fact that integrating ZaloPay often requires a live, published Mini App, yet a Mini App with a non-functional payment feature may be rejected. The officially sanctioned workaround for this is to first submit the Mini App for review as an "Internal" application. An internal app is not publicly discoverable but is accessible via a direct QR code or deeplink. The developer can share this internal version with the ZaloPay team to complete the integration. Once payment functionality is fully implemented and tested, the developer must submit a new version for review, this time requesting it be categorized as "External" for public release. This procedural nuance is critical for any agent with transactional capabilities.

The platform's governance structures have profound implications for agent design. An agent's core logic must be developed defensively, incorporating strategies like exponential backoff for rate-limited APIs and stateful tracking of permission requests to avoid violating user-centric limits. The review process itself should be treated as a business proposal, not a simple technical deployment. The "Version description" field in the submission form is a critical channel for communicating the agent's purpose and justifying its API needs to the human reviewers at Zalo.

Section 5: Strategic Implementation Patterns for Intelligent Agents
The preceding analysis has deconstructed the Zalo API ecosystem and its governing policies. This final section synthesizes that knowledge into actionable architectural blueprints. These patterns provide strategic templates for building specific types of intelligent agents, demonstrating how to orchestrate the necessary APIs in a manner that is both effective and compliant with the platform's constraints.

5.1 Architectural Blueprint for a Conversational Agent (Customer Service Bot)
Objective: To create an agent capable of engaging in natural language conversations to resolve user queries, provide automated support, and guide users through simple tasks, thereby reducing the load on human support staff.

Core Components & API Orchestration:

Frontend (Mini App): The user interface is centered around a chat component. The primary entry point for a conversation is a UI element (e.g., a "Help" button) that triggers the openChat API. Before opening the chat, the agent can call 

getUserInfo to retrieve the user's name, allowing for a personalized greeting like, "Hello [User Name], how can I assist you today?".

State Management: To create a seamless conversational experience, client-side nativeStorage is used to cache the conversation history. If the user navigates away from the chat and then returns, the agent can use 

getItem to reload the previous messages, providing continuity.

Backend (Server): This component serves as the agent's "brain." It exposes an endpoint that the Mini App client calls to send user messages. This backend service integrates with a Natural Language Processing (NLP) engine (such as a third-party service like Google Dialogflow or a custom-trained model) to perform intent recognition and entity extraction on the user's input.

Logic and Integration: The backend uses the accessToken sent from the client to securely identify the user. Based on the recognized intent, it executes the appropriate business logic. This may involve querying an internal knowledge base, looking up order details in a database, or calling other Zalo Open APIs. The generated response is then sent back to the client to be rendered in the chat UI.

Proactive Engagement: During the conversation, the agent can identify opportunities to request permissions for future engagement. For example, after resolving an issue, it might ask, "Would you like me to notify you with updates about your case?" If the user agrees, the client calls requestSendNotification. With this permission granted, the backend can later use the Official Account API to send asynchronous follow-up messages.

5.2 Framework for a Proactive E-commerce Agent (Personal Shopper)
Objective: To create an agent that acts as a personal shopper, guiding users through product discovery, managing a shopping cart, and streamlining the checkout process, while providing personalized recommendations to increase conversion rates.

Core Components & API Orchestration:

Context Gathering: Upon application launch, the agent immediately begins building context. It calls getUserInfo for personalization and uses getItem to retrieve the user's browsing history or previously saved preferences from nativeStorage. It may also request 

getLocation to tailor results by showing product availability at nearby physical stores.

Product Discovery and UI: The agent's main interface displays product listings fetched from its backend. The UI is constructed using the officially provided ZaUI component library to ensure a native look and feel and to accelerate development, as demonstrated in the various official templates.

Client-Side Cart Management: To ensure a highly responsive and fast user experience, the shopping cart is managed entirely on the client side. When a user adds or removes an item, the agent updates a 'cart' object in nativeStorage using setItem. This approach avoids the network latency of a server call for every cart modification and ensures the cart's state persists even if the user closes and reopens the Mini App.

Secure Checkout Flow: When the user initiates checkout, the agent reads the final cart state from nativeStorage and sends it to its backend. The backend validates the cart, calculates totals, creates a secure order record in its database, and generates the necessary parameters for payment. These parameters are returned to the client, which then calls the createOrder function from the ZaloPay Checkout SDK to hand off the user to the secure, native ZaloPay payment interface.

Post-Purchase Communication: Upon receiving a successful payment confirmation via a server-side callback from ZaloPay, the agent's backend leverages the previously acquired notification permission to send a detailed order confirmation and receipt to the user via the Official Account API.

5.3 Model for a Service-Oriented Agent (Appointment Booker/Notifier)
Objective: To automate the process of booking and managing appointments for a service-based business (e.g., a medical clinic, salon, or consultancy), including sending timely reminders to reduce no-shows.

Core Components & API Orchestration:

Efficient Onboarding: The agent's first interaction is designed for maximum efficiency. It uses getUserInfo and the secure getPhoneNumber flow to pre-fill the booking form with the user's name and contact number, minimizing manual data entry. Concurrently, it calls 

requestSendNotification, presenting a clear and compelling value proposition: "Allow notifications to receive important reminders about your upcoming appointments".

Booking and Confirmation: The user selects a desired service, date, and time from an interface populated with availability data from the agent's backend. Upon submission, the backend validates the time slot, confirms the booking in its database, and sends an immediate confirmation back to the client.

Social Engagement: After a successful booking, the agent can foster social engagement. It might use openShareSheet to present an option like, "Share your appointment with a friend?". For returning customers, it could use the 

addRating API to prompt for feedback on their previous service experience.

Asynchronous Backend Logic: The core of the agent's proactive value lies in its backend. This server runs scheduled tasks (e.g., using cron jobs) that periodically scan the appointments database. For example, 24 hours and again 1 hour before a scheduled appointment, the backend automatically triggers a reminder message sent to the user via the Official Account API.

Seamless OA Integration: The agent can further enhance the experience by using the interactOA API to provide quick actions or information directly within the OA chat environment, creating a fully integrated service loop between the interactive Mini App and the persistent communication channel.

The following table summarizes these architectural patterns, providing a high-level strategic comparison for architects and product managers.

Table 5.1: Agent Implementation Pattern Matrix

Appendix: Comprehensive Zalo Mini App API Reference Table
This appendix serves as a consolidated, quick-reference guide to the client-side Zalo Mini App (ZMP) SDK APIs identified from the available documentation. Given the fragmented nature of the official resources, this table provides a unified view for developers, organized by functional category.

Table A.1: Zalo Mini App Client-Side SDK API Reference

Category	Sub-Group	API Function	Description	Source(s)
Basic	-	getAppInfo	Retrieves basic information about the Mini App.	
Basic	-	getContextAsync	Retrieves context information about the Zalo App environment.	
Basic	-	getDeviceIdAsync	Retrieves a unique identifier for the device.	
Basic	-	getSystemInfo	Retrieves information about the user's device and system.	
Routing	-	closeApp	Closes the current Mini App.	
Routing	-	getRouteParams	Retrieves parameters passed to the current route.	
Routing	-	openMiniApp	Opens another Zalo Mini App.	
Routing	-	openWebview	Opens a webview within the Zalo App.	
Routing	-	sendDataToPreviousMiniApp	Sends data back to the Mini App that opened the current one.	
Storage	-	setItem	Stores a key-value pair in the user's device cache (synchronously).	
Storage	-	getItem	Retrieves a value by its key from the device cache (synchronously).	
Storage	-	removeItem	Removes a key-value pair from the device cache.	
Storage	-	clear	Clears all data from the device cache.	
Storage	-	getStorageInfo	Retrieves information about the storage usage and limits.	
UI	Feedback	showToast	Displays a short-lived notification message (toast).	
UI	Feedback	closeLoading	Closes the initial loading splash screen.	
UI	View	configAppView	Configures the appearance of the app view.	
UI	View	setNavigationBarTitle	Sets the title text in the navigation bar.	
UI	View	setNavigationBarColor	Sets the background color of the navigation bar.	
UI	View	setNavigationBarLeftButton	Configures the left button in the navigation bar.	
UI	Keyboard	hideKeyboard	Hides the on-screen keyboard.	
Location	-	getLocation	Retrieves the current geographical location of the user.	
Media	Camera	createCameraContext	Creates a context for managing the camera.	
Media	Camera	requestCameraPermission	Requests permission from the user to access the camera.	
Media	Camera	checkZaloCameraPermission	Checks the current camera permission status.	
Media	File	chooseImage	Opens the gallery for the user to select an image.	
Media	File	openMediaPicker	Opens the gallery for the user to select various media types.	
Media	File	saveImageToGallery	Saves an image to the device's photo gallery.	
Media	File	saveVideoToGallery	Saves a video to the device's video gallery.	
Media	File	downloadFile	Downloads a file from a remote URL to the device.	
Media	File	openDocument	Opens a document file (e.g., PDF).	
User	Authorization	authorize	Requests specific API usage permissions from the user.	
User	User information	getAccessToken	Retrieves the user's authentication token.	
User	User information	getUserInfo	Retrieves the user's profile information (ID, name, avatar).	
User	User information	getUserID	Retrieves the unique user ID for the application.	
User	User information	getPhoneNumber	Retrieves a token to securely get the user's phone number.	
User	Setting	getSetting	Retrieves the user's current settings information.	
Device	Scan	scanQRCode	Opens the camera to scan a QR code.	
Device	Network	getNetworkType	Gets the current network connection type (e.g., wifi, 4g).	
Device	Network	onNetworkStatusChange	Listens for changes in the network connection status.	
Device	NFC	checkNFC	Checks if the device supports NFC.	
Device	NFC	scanNFC	Initiates an NFC scan.	
Device	Contact	openPhone	Opens the device's native phone dialer with a number.	
Device	Contact	openSMS	Opens the device's native SMS application with a number.	
Device	Screen	keepScreen	Prevents the device screen from turning off.	
Device	-	vibrate	Activates the device's vibration.	
Device	Biometric Auth	checkStateBioAuthentication	Checks the status of biometric authentication availability.	
Device	Biometric Auth	openBioAuthentication	Opens the biometric authentication interface.	
Permission	-	requestSendNotification	Requests user permission to send notifications via the OA.	
Permission	-	openPermissionSetting	Opens the user's permission settings page for the Mini App.	
Zalo	-	openChat	Opens a chat window with a user or Official Account.	
Zalo	-	openProfile	Opens the profile page of a user or Official Account.	
Zalo	-	openProfilePicker	Opens a friend selector UI.	
Zalo	-	openShareSheet	Opens the native Zalo sharing interface.	
Zalo	-	followOA	Prompts the user to follow the linked Official Account.	
Zalo	-	unfollowOA	Prompts the user to unfollow the linked Official Account.	
Zalo	-	interactOA	Initiates an interaction with the Official Account.	
Zalo	-	addRating	Prompts the user to add a rating for the Mini App.	
Zalo	-	favoriteApp	Prompts the user to add the Mini App to their favorites.	
Zalo	-	createShortcut	Prompts the user to create a home screen shortcut for the Mini App.	
Zalo	-	minimizeApp	Minimizes the current Mini App.	
Zalo	-	openPostFeed	Opens the interface to post on the user's feed (Nhật ký).	
Zalo	-	requestUpdateZalo	Prompts the user to update their Zalo application.	
Zalo	-	viewOAQr	Displays the QR code for the linked Official Account.	
Advertising	-	setupAd	Configures the advertising unit.	
Advertising	-	loadAd	Loads an ad to be displayed.	
Advertising	-	displayAd	Displays a previously loaded ad.	
Advertising	-	refreshAd	Refreshes an ad unit.	
Widgets	-	showFunctionButtonWidget	Displays the Function Button Widget.	
Widgets	-	showOAWidget	Displays the Official Account (OA) Widget.	

Sources used in the report

miniapp.zaloplatforms.com
Opens in a new window

Sources read but not used in the report
