---
title: "Enterprising Agents"
date: "2026-03-15"
excerpt: "We’re moving past the 'one model' myth. Scaling enterprise AI requires a shift to specialized agents, mTLS-backed identity, and the end of the manual integration era."
tags: ["ai", "agents", "context-engineering", "a2a"]
githubUrl: "https://github.com/balorette/a2a-experience"
status: "in-progress"
featured: true
published: true
---

## **Agent-as-an-Interface**

I’ve spent a lot of time recently digging into what enterprise-scale agents and their surrounding implementations will actually look like. As I prototyped various scenarios, one question kept surfacing: **Who is responsible for building what?**

Think about your CRM. You bought it because you don't want to build a CRM; you want the benefits of being a consumer. Historically, if the vendor gave you an API, you’d just hook that into your own systems. But that pattern is shifting. I recently found myself starting to build a "CRM agent" from scratch, and it felt wrong. If a vendor provides an API, why wouldn't they provide the next logical evolution: **an Agent as an Interface?**

## **It’s Always About Personas**

For this, we can use two distinct personas: the **Vendor** and the **Customer**.

From the customer perspective, the primary focus is what does my business actually need? Lets say I am running an aftermarket auto parts storefront, my time is best spent building agents that optimize _my_ business: my sales strategy, my local inventory, my customer relationships. I shouldn't be wasting compute or engineering hours building agents to navigate the specific logic of my wholesale parts vendor, my shipping provider, or my CRM. 

The need is **"Agent-to-Agent"** communication. The customer wants to point their "Generalist" agent at the Vendor's "Specialist" agent and let them figure it out. For the vendor, this is a massive differentiator. They can offer three doors for integration: **UI, API, or Agent.**

## **The Architecture: The "Agent Switchboard"**

Building a vendor agent isn't just about handing an LLM a list of tools and hoping for the best. Just like other solutions, we still have to solve for security, cost, and latency.

- **Security & Identity:** Building from lessons learned in Cloud Native and Micro Service architectures. Identity should be handled via **mTLS (mutual TLS)** for agent-to-agent attestation. Beyond the "pipe," we need OAuth 2.0 Actor Token Exchange or identity chaining to ensure the vendor agent is acting strictly on behalf of a specific user and only touching authorized data.

- **The Router (Semantic Routing):** Just like old-school switchboard operators, we need a **Classifier/Router Agent**. When a request hits the vendor’s front door, we don't always need a high-cost LLM call. Consider things like:
    - **Simple Query:** _"Give me my list of customers."_ The router sends this to a deterministic, non-LLM endpoint. It’s fast, cheap, and precise.
    - **Complex Insight:** _"Show me recent customer trends from the top 5 customers in the Southeast with a breakdown of CRM engagement."_ This is routed to the **Orchestrator Agent**, which uses its specialized tools and downstream sub-agents to synthesize the answer.

By offloading this complexity to the vendor, the customer’s agent stays "lean." It doesn't need to know the schema of the CRM; it just needs to know how to ask the Vendor Agent for the result.

## **The Challenges of Distributed Logic**

Managing context across these systems is a two-way street, but the Vendor side carries a relatively  heavier burden. There scale will often be much larger and simply passing the cost onto the customer will be scrutinized. This starts to highlight these concepts and challenges many are already dealing with:  

**Progressive Disclosure in Context:** A vendor agent shouldn't dump its entire world into a response. They need to operate on the principle of **progressive disclosure**—giving the customer agent exactly what is needed for the next step, and no more. This prevents "context noise" and keeps token costs down. The customer agent, in turn, needs to be smart enough to ask, _"I have X, but to finish this task, I also need Y. Can you provide that?"_ (I’ve been exploring these patterns in my **Agentic Contextualizer** project).

**Human-in-the-Loop (HITL) & Escalation:** What happens when the agents get stuck? We need a standardized way for a vendor agent to surface an escalation request that the customer agent can interpret. This might mean the customer agent prompts a human in their own UI to resolve a vendor-side ambiguity.

**The State Problem:** Dealing with state across organizational boundaries is non-trivial. This is where **Session IDs** become a mandatory part of the communication spec. By enforcing unique session IDs, we can split state management between systems, using the ID as the shared lookup key to maintain a coherent "conversation" without passing massive amounts of history back and forth. A fun bonus is these Session IDs could be tied to **Vector Store** namespaces. Then the "state" isn't just a database row, but a temporary memory space for that specific task.

## **Off to the Future**
We are moving past the "LLM in a box" phase of AI. The future isn't one giant, all-knowing model. We've been seeing this come up in Architectures that highlight leveraging specific and often smaller models for tasks. Or workflows that use expensive models for coordination and cheaper models for implementations. The future really is **Agent Swarms**. A distributed network of specialist agents talking to each other across organizational boundaries with targeted models fit for use.

By shifting to an **Agent-as-an-Interface** model, we solve one of the large hurdles in enterprise AI: **The specialized logic gap.**

- **Vendors** get to protect their IP and own their logic while providing a high-value, "low-friction" integration door.
- **Customers** get to stop building "wrapper agents" for every SaaS tool in their stack and finally focus on their own proprietary business logic, their "secret sauce."

This architecture, leveraging **A2A**, **Semantic Routing**, **Identity Chaining**, and patterns like **Progressive Disclosure**, is how we make ecosystems of agents actually usable at scale. It’s about how we can actually see agents bringing value and creating an actual ROI. Now I just need to find the right Door... 