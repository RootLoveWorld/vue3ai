
import { ref, onUnmounted } from 'vue';

interface SSEOptions {
  url: string;
  eventName?: string;
  autoReconnect?: boolean;
  retryInterval?: number;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
}

export function useSSE(options: SSEOptions) {
  const data = ref<any>(null);
  const error = ref<Event | null>(null);
  const status = ref<'CONNECTING' | 'OPEN' | 'CLOSED'>('CONNECTING');
  let eventSource: EventSource | null = null;

  const initSSE = () => {
    eventSource = new EventSource(options.url);

    eventSource.onopen = () => {
      status.value = 'OPEN';
    };

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const parsedData = JSON.parse(event.data);
        data.value = parsedData;
        options.onMessage?.(parsedData);
      } catch (e) {
        console.error('SSE data parse error', e);
      }
    };

    if (options.eventName) {
      eventSource.addEventListener(options.eventName, (event: MessageEvent) => {
        try {
          const parsedData = JSON.parse(event.data);
          data.value = parsedData;
          options.onMessage?.(parsedData);
        } catch (e) {
          console.error('SSE data parse error', e);
        }
      });
    }

    eventSource.onerror = (err) => {
      error.value = err;
      status.value = 'CLOSED';
      options.onError?.(err);
      if (options.autoReconnect !== false) {
        setTimeout(initSSE, options.retryInterval || 5000);
      }
    };
  };

  const close = () => {
    eventSource?.close();
    status.value = 'CLOSED';
  };

  onUnmounted(close);
  initSSE();

  return { data, error, status, close };
}
