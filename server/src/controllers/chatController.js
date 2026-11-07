import { generateChatResponse } from '../services/geminiService.js';
import { getSupabase } from '../config/supabase.js';
import { randomUUID } from 'crypto';

export async function handleChatMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const { message, language = 'en', conversationId = randomUUID() } = req.body;

    const supabase = getSupabase();

    // 1. Store user message in database
    if (supabase) {
      await supabase.from('chat_messages').insert({
        user_id: userId,
        conversation_id: conversationId,
        role: 'user',
        content: message
      });
    }

    // 2. Generate structured agricultural advice from Gemini
    const aiResult = await generateChatResponse({ message, language });

    // 3. Store assistant message in database
    if (supabase) {
      await supabase.from('chat_messages').insert({
        user_id: userId,
        conversation_id: conversationId,
        role: 'assistant',
        content: JSON.stringify(aiResult)
      });
    }

    res.status(200).json({
      success: true,
      message: 'Agricultural assistant responded',
      data: {
        conversationId,
        role: 'assistant',
        ...aiResult
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getConversationHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const conversationId = req.params.conversationId;

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Chat history (empty)',
        data: []
      });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Conversation history retrieved',
      data: data || []
    });
  } catch (err) {
    next(err);
  }
}
