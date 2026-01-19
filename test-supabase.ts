import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thhpsyqjbrmrfrkdgvrc.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoaHBzeXFqYnJtcmZya2RndnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MTAyNzksImV4cCI6MjA4NDA4NjI3OX0.XwobwMPDg3Hdq8wzEV1OPfby0TPrTRJHBMp5BLna2d8';

async function checkChats() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.from('chats').select('*').limit(1);

  if (error) {
    console.error('Error fetching chats:', error);
  } else {
    console.log('Sample chat:', data);
  }
}

async function testInsert() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const testId = 'test-' + Date.now();
  const { error } = await supabase.from('messages').insert({
    id: testId,
    chat_id: '019127f7-74de-442c-a579-0cc05fe1b710', // Use a known chat ID or a dummy one if possible
    role: 'user',
    content: JSON.stringify([{ type: 'text', text: 'test' }]),
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Test insert failed:', error);
  } else {
    console.log('Test insert successful!');
    // Clean up
    await supabase.from('messages').delete().eq('id', testId);
  }
}

checkChats().then(() => testInsert());
