import axiosInstance, { mockApi } from './axiosInstance';

export var executeAPI = {
  runCode: async function(code) {
    if (mockApi.isActive) {
      await mockApi.delay(1000);
      try {
        var logs = [];
        var origLog = console.log;
        console.log = function() {
          var args = Array.from(arguments);
          logs.push(args.map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' '));
        };
        var startTime = performance.now();
        new Function(code)();
        var endTime = performance.now();
        console.log = origLog;
        return { data: { output: logs.join('\n') || '(no output)', error: null, durationMs: Math.round(endTime - startTime) } };
      } catch(err) {
        return { data: { output: null, error: err.message, durationMs: 0 } };
      }
    }
    var response = await axiosInstance.post('/execute', { code: code });
    // Map backend response to expected format
    var result = response.data;
    return {
      data: {
        output: result.output || null,
        error: result.error || null,
        durationMs: parseInt(result.executionTime) || 0,
      }
    };
  }
};