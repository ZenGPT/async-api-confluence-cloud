import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { BookOpenIcon, PencilAltIcon, ExclamationCircleIcon, ClipboardCopyIcon } from '@heroicons/react/solid'

interface PureApiDocItemProps {
  id: string;
  title: string;
  description: string;
  version: string;
  createdDate?: string;
  createdBy?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  hasError?: boolean;
  isLoading?: boolean;
}

export default function PureApiDocItem(props: PureApiDocItemProps) {
  function editApiDoc() {
    // @ts-ignore
    AP.dialog.create({
      key: 'editApiDoc',
      chrome: false,
      customData: {
        contentId: props.id
      }
    });
  }

  function copyContentId(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    const updateFeedback = (message: string, isError = false) => {
      const element = document.getElementById(`content-id-${props.id}`);
      if (element) {
        const originalText = element.textContent;
        element.textContent = message;
        element.style.color = isError ? '#ef4444' : '#10b981';
        setTimeout(() => {
          element.textContent = originalText;
          element.style.color = '';
        }, 2000);
      }
    };

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(props.id)
        .then(() => {
          updateFeedback('Copied!');
        })
        .catch((err) => {
          console.warn('Clipboard API failed, trying fallback:', err);
          tryFallbackCopy();
        });
    } else {
      tryFallbackCopy();
    }

    function tryFallbackCopy() {
      try {
        // Create a temporary textarea element
        const textArea = document.createElement('textarea');
        textArea.value = props.id;
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        textArea.style.width = '1px';
        textArea.style.height = '1px';
        textArea.style.opacity = '0';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        
        // Select and copy without focusing
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          updateFeedback('Copied!');
        } else {
          throw new Error('execCommand copy failed');
        }
      } catch (fallbackErr) {
        console.error('All copy methods failed:', fallbackErr);
        // Show the content ID in a prompt as last resort
        prompt('Copy this content ID manually:', props.id);
        updateFeedback('Content ID shown in prompt', true);
      }
    }
  }

  function reloadPage() {
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href
  }

  function deleteApiDoc() {
    const contentId = props.id;
    // @ts-ignore
    const localAp = AP;
    const url = `/rest/api/content/${contentId}`;
    localAp.request({
      url,
      data: {
        "expand": "body.raw,container,version,space"
      },
      success: function (response: any) {
        const content = JSON.parse(response);
        const container = content.container;
        if(container?.type === 'page') {
          alert('This content is currently in use in a page. Please update the page to remove the usage first.')
        } else {
          alert('Are you sure to delete?')
          // @ts-ignore
          localAp.request({type: 'PUT', url, contentType: 'application/json', data: JSON.stringify(Object.assign({}, content, {status: 'trashed', version: {number: content.version.number + 1}}))}).then(reloadPage, () => alert('Error'));
        }
      }
    });

  }

  // Determine visual styling based on state
  const containerClasses = `group relative ${
    props.hasError 
      ? 'bg-red-50 border-red-200' 
      : 'bg-white border-gray-200'
  } rounded-lg flex flex-col overflow-hidden divide-y divide-gray-200 ${
    props.isLoading ? 'animate-pulse' : ''
  }`;

  const titleClasses = `text-sm font-medium ${
    props.hasError ? 'text-red-800' : 'text-gray-900'
  } ${props.isLoading ? 'bg-gray-200 h-4 rounded' : ''}`;

  return (
    <>
      <div
        key={props.id}
        className={containerClasses}
      >
        <div className="flex-1 p-6 space-y-4 flex flex-col">
          {/* Header with title and status */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              {props.hasError && (
                <ExclamationCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold leading-6 ${props.hasError ? 'text-red-800' : 'text-gray-900'} ${
                  props.isLoading ? 'bg-gray-200 h-6 rounded' : ''
                }`}>
                  {props.isLoading && !props.title ? 'Loading...' : props.title}
                </h3>
                {!props.isLoading && props.version && (
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      props.hasError 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      v{props.version}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={`text-sm leading-5 ${props.hasError ? 'text-red-600' : 'text-gray-600'} ${
            props.isLoading && !props.description ? 'bg-gray-200 h-12 rounded' : ''
          }`}>
            {props.isLoading && !props.description ? (
              <div className="space-y-2">
                <div className="bg-gray-200 h-3 rounded w-full"></div>
                <div className="bg-gray-200 h-3 rounded w-4/5"></div>
                <div className="bg-gray-200 h-3 rounded w-3/5"></div>
              </div>
            ) : (
              <ReactMarkdown 
                children={props.description || 'No description available'} 
                remarkPlugins={[remarkGfm]}
                className="prose prose-sm max-w-none"
              />
            )}
          </div>

          {/* Footer with metadata */}
          <div className="flex-1 flex flex-col justify-end space-y-2 pt-2 border-t border-gray-100">
            {/* Creation info */}
            {props.createdDate && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="font-medium">Created:</span>
                <span className="ml-1">
                  {new Date(props.createdDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {props.createdBy && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="font-medium text-gray-700">{props.createdBy}</span>
                  </>
                )}
              </div>
            )}
            
            {/* Content ID with copy button */}
            <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              <p 
                id={`content-id-${props.id}`}
                className={`text-xs font-mono ${props.hasError ? 'text-red-500' : 'text-gray-500'} ${
                  props.isLoading && !props.version ? 'bg-gray-200 h-3 rounded w-1/4' : ''
                }`}
              >
                ID: {props.id}
              </p>
              <button
                onClick={copyContentId}
                className={`ml-2 p-1.5 rounded-md hover:bg-gray-100 transition-colors z-10 relative ${
                  props.hasError ? 'text-red-400 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Copy content ID"
                disabled={props.isLoading}
                type="button"
              >
                <ClipboardCopyIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex space-x-3">
            <button
              onClick={!props.isLoading && !props.hasError ? props.onClick : undefined}
              disabled={props.isLoading || props.hasError}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-transparent transition-colors ${
                props.isLoading || props.hasError 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              <BookOpenIcon className={`w-4 h-4 mr-2 ${
                props.isLoading || props.hasError ? 'text-gray-300' : 'text-white'
              }`} aria-hidden="true" />
              View
            </button>
            
            <button
              onClick={!props.isLoading ? editApiDoc : undefined}
              disabled={props.isLoading}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                props.isLoading 
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              <PencilAltIcon className={`w-4 h-4 mr-2 ${
                props.isLoading ? 'text-gray-300' : 'text-gray-500'
              }`} aria-hidden="true" />
              Edit
            </button>
            
            <button
              onClick={!props.isLoading ? deleteApiDoc : undefined}
              disabled={props.isLoading}
              className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                props.isLoading 
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
