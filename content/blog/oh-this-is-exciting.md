---
title: "Oh this is exciting"
date: "2026-03-15"
slug: "oh-this-is-exciting"
image: "/images/blog/oh-this-is-exciting-header.jpg"
category: "Industry Updates"
---

Let's chat about a few things that caught my eye!

## Smarter AI & Coding Companions

First off, it feels like AI is becoming less of a general assistant and more of a specialized, super-smart teammate for developers. Google's **Gemini Code Assist** is really pushing the envelope here. They've introduced features like **Agent Mode with Auto Approve** and **Inline Diff Views**, which sound like they make the AI truly adapt to how *you* code. Imagine an AI that not only suggests code but can also apply complex refactoring patterns or complete your pseudocode just by observing your current edits. That's what **Finish Changes** in IntelliJ and VS Code aims to do – turning Gemini into a true "pair programmer."

And for those of us tackling big projects, **Gemini CLI's Plan Mode** is a game-changer. It creates a read-only environment where the AI can analyze your entire codebase and map out architectural changes *without* any risk of accidentally messing things up. This collaborative approach, where you can refine strategies with the AI and even pull in external data, sounds like it'll make big development tasks much smoother and less error-prone.

## Powering Up Our Apps: Data and Beyond

On the data front, **Elastic 9.3.0** just dropped, and it's bringing some seriously cool enhancements, especially for those working with large language models. They've really boosted their **vector search indexing for RAG (Retrieval Augmented Generation) applications**. This means AI systems can pull information from huge databases much more efficiently, leading to more accurate and context-rich answers. Plus, upgrades to their ES|QL query language and deeper **OpenTelemetry integration** mean better insights into how our systems are performing. It's all about making our applications smarter and more resilient.

Even everyday apps are getting a clever tech boost. The engineers at Grab, for example, found a neat way to improve their Android app's performance. They switched from a standard "Least Recently Used" (LRU) cache for images to a **Time-Aware Least Recently Used (TLRU) cache**. This might sound technical, but it simply means their app can manage image storage much more effectively, reclaiming space without slowing things down or racking up server costs. It's a subtle change that makes a big difference in user experience!

## AI for Exploration and Connection

Beyond core development, AI is sparking some really creative projects. I came across this amazing hackathon project called **Ethni-CITY**. It uses Google's Gemini 3.1 pro preview to perform deep multimodal analysis on uploaded photos – think landmarks, cultural motifs, lighting – to identify the city and country where a picture was taken. Then, it uses Cesium JS and Google Cloud's photorealistic tiles to virtually transport you to that location, helping to tell a "centric story" and even promote local artists. How cool is that for a way to explore and connect with cultures!

## Staying Connected Off-Grid: Safety and Innovation

And for those who venture beyond cell tower range, there's a brilliant innovation called **Red Grid Link**. This app, built for peer-to-peer team coordination, lets you sync positions over Bluetooth and WiFi Direct – no servers, no subscriptions, no extra hardware needed! It's designed for situations where knowing everyone's location is a safety issue, like search-and-rescue or backcountry hiking.

What's really clever about Red Grid Link is how it tackles the challenges of off-grid communication:
*   **No Central Authority:** It uses **CRDTs (Conflict-free Replicated Data Types)**, meaning devices can update information (like a map marker) even when disconnected, and when they reconnect, everything merges perfectly without conflicts. Imagine editing a document with friends, and it just *works* regardless of who's online when.
*   **Battery Friendly:** It has "Expedition Mode" and "Ultra Expedition Mode" to drastically reduce battery drain, critical for long trips.
*   **Robust Security:** Positions are encrypted using strong standards like ECDH for key exchange and AES-256-GCM for data, with options for different security postures like PINs or QR codes for joining.

It's a fantastic example of using existing phone radios to create robust, secure, and truly decentralized communication, which is a powerful concept.

## Learning and Growing at Any Age

Finally, a truly inspiring message I read was from someone who made a radical career jump into coding at 36. They shared that age isn't a barrier; in fact, it can be a **competitive advantage**. Soft skills like resilience, communication, and discipline, honed over years in other careers, are invaluable in the tech world. This person emphasized focusing on one path (like JavaScript/Web), consistency over intensity, and actively "building broken things" to learn. It's a powerful reminder that critical thinking and the ability to see the "big picture" – qualities that often come with experience – are exactly what's needed as AI reshapes our industry. Your age isn't a bug; it's a feature!

So, while the crypto markets might be doing their thing, it's clear that innovation across the tech spectrum is full steam ahead. From smarter AI for developers to clever data management and groundbreaking off-grid communication, there's so much to be excited about!