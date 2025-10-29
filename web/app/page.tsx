'use client'

import { useState, useEffect } from 'react'

export default function Home(): JSX.Element {
  const [task, setTask] = useState('')
  const [status, setStatus] = useState<'idle' | 'running' | 'stopped'>('idle')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [extensionInstalled, setExtensionInstalled] = useState(false)

  useEffect(() => {
    // Check if extension is installed
    const checkExtension = () => {
      if (typeof window !== 'undefined' && (window as any).surfai) {
        setExtensionInstalled(true)
        setResult('✅ Extension detected and ready')
      } else {
        setResult('⚠️ Extension not detected. Please install the SurfAI extension.')
      }
    }
    checkExtension()
    const interval = setInterval(checkExtension, 2000)
    return () => clearInterval(interval)
  }, [])

  const startAgent = async () => {
    if (!task.trim()) {
      setResult('⚠️ Please enter a task')
      return
    }

    if (!extensionInstalled) {
      setResult('❌ Extension not installed. Please install the SurfAI Chrome extension first.')
      return
    }

    setLoading(true)
    setStatus('running')
    setResult('🤖 Agent starting...\n\nStep 1: Generating AI plan...')

    try {
      // Step 1: Generate plan from AI
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'web-user',
          domContext: 'Current page',
          task: task
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(`✅ Plan generated:\n${data.data.plan}\n\nStep 2: Sending to extension...`)
        
        // Step 2: Send to extension
        if ((window as any).surfai) {
          await (window as any).surfai.executeTask(task)
          setResult(`✅ Task sent to extension!\n\nThe agent is now working on: "${task}"\n\nCheck the current tab for AI actions.`)
        } else {
          setResult(`⚠️ Plan ready but extension not responding.\n\n${data.data.plan}`)
        }
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const stopAgent = () => {
    setStatus('stopped')
    setResult('⏹️ Agent stopped by user')
    
    if ((window as any).surfai) {
      (window as any).surfai.stop()
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠 SurfAI - AI Browser Agent</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Backend API for autonomous web intelligence</p>

      <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Agent Control Panel</h2>
          <div style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: extensionInstalled ? '#d1fae5' : '#fee2e2',
            color: extensionInstalled ? '#065f46' : '#991b1b',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            {extensionInstalled ? '✅ Extension Connected' : '❌ Extension Not Found'}
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Task Description:
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g., Find all links on example.com and summarize the page"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '2px solid #ddd',
              fontSize: '1rem',
              minHeight: '100px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={startAgent}
            disabled={loading || status === 'running'}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#ccc' : '#10b981',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? '⏳ Running...' : '▶️ Start Agent'}
          </button>

          <button
            onClick={stopAgent}
            disabled={status !== 'running'}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              background: status === 'running' ? '#ef4444' : '#ccc',
              color: 'white',
              cursor: status === 'running' ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            ⏹️ Stop Agent
          </button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Status:</strong>{' '}
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            background: status === 'running' ? '#fef3c7' : status === 'stopped' ? '#fee2e2' : '#e5e7eb',
            color: status === 'running' ? '#92400e' : status === 'stopped' ? '#991b1b' : '#1f2937'
          }}>
            {status === 'running' ? '🟢 Running' : status === 'stopped' ? '🔴 Stopped' : '⚪ Idle'}
          </span>
        </div>

        {result && (
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            border: '2px solid #ddd',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            {result}
          </div>
        )}
      </div>

      <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #3b82f6' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📚 API Endpoints</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><code>/api/plan</code> - Generate action plans</li>
          <li><code>/api/vision</code> - Analyze screenshots</li>
          <li><code>/api/memory</code> - Store/retrieve memories</li>
          <li><code>/api/feedback</code> - Log agent actions</li>
        </ul>
      </div>
    </main>
  )
}
