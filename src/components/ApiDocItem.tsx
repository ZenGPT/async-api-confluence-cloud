import React, {useEffect, useState} from 'react';

import PureApiDocItem from "./PureApiDocItem";
import yaml from "js-yaml";

interface ApiDocSummary {
  id: string;
  description: string;
  title: string;
  version: string;
  createdDate?: string;
  createdBy?: string;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Helper function to safely parse JSON
function safeJsonParse(jsonString: string, context: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Failed to parse JSON for ${context}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to safely load YAML
function safeYamlLoad(yamlString: string): any {
  try {
    return yaml.load(yamlString);
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to extract API doc info safely
function extractApiDocInfo(response: any, contentId: string): ApiDocSummary {
  const apiDoc = safeJsonParse(response, 'API response');
  
  if (!apiDoc.body?.raw?.value) {
    throw new Error('Missing document content in response');
  }
  
  const apiDocContent = safeJsonParse(apiDoc.body.raw.value, 'document content');
  
  if (!apiDocContent.code && !apiDocContent.schema) {
    throw new Error('No code or schema found in document content');
  }
  
  const schema = safeYamlLoad(apiDocContent.code || apiDocContent.schema);
  
  return {
    id: contentId,
    description: schema?.info?.description || 'No description available',
    title: apiDoc.title || 'Untitled Document',
    version: schema?.info?.version || 'Unknown version',
    createdDate: apiDoc.history?.createdDate,
    createdBy: apiDoc.history?.createdBy?.displayName
  };
}

export default function ApiDocItem(props: ApiDocSummary) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // @ts-ignore
    AP.navigator.go('contentview', {contentId: props.id});
  }
  
  const [apiDocSummary, setApiDocSummary] = useState<ApiDocSummary>({
    id: "", 
    description: "", 
    title: "", 
    version: "",
    createdDate: undefined,
    createdBy: undefined
  });
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    setLoadingState({ isLoading: true, error: null });
    
    // @ts-ignore
    AP.request({
      url: `/rest/api/content/${props.id}`,
      data: {
        "expand": "body.raw,history"
      },
      success: function (response: any) {
        if (!isMounted) return;
        
        try {
          const docInfo = extractApiDocInfo(response, props.id);
          setApiDocSummary(docInfo);
          setLoadingState({ isLoading: false, error: null });
        } catch (error) {
          console.error('Error processing API document:', error);
          setLoadingState({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to process document'
          });
          
          // Try to extract at least the basic info and history even if document parsing fails
          let apiDoc;
          try {
            apiDoc = safeJsonParse(response, 'API response');
          } catch {
            apiDoc = {};
          }
          
          // Set fallback data with any available information
          setApiDocSummary({
            id: props.id,
            description: 'Error loading description',
            title: props.title || apiDoc.title || 'Error loading document',
            version: 'Unknown',
            createdDate: apiDoc.history?.createdDate,
            createdBy: apiDoc.history?.createdBy?.displayName
          });
        }
      },
      error: function (xhr: any) {
        if (!isMounted) return;
        
        console.error('API request failed:', xhr);
        const errorMessage = xhr.status === 404 
          ? 'Document not found' 
          : xhr.status === 403 
            ? 'Access denied'
            : `Request failed (${xhr.status})`;
            
        setLoadingState({ isLoading: false, error: errorMessage });
        // Set fallback data
        setApiDocSummary({
          id: props.id,
          description: 'Failed to load content',
          title: props.title || 'Document unavailable',
          version: 'Unknown',
          createdDate: undefined,
          createdBy: undefined
        });
      }
    });
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [props.id, props.version]);

  // Determine what to display based on loading state
  const displayProps = {
    id: props.id,
    description: loadingState.isLoading 
      ? 'Loading...' 
      : loadingState.error 
        ? `Error: ${loadingState.error}`
        : apiDocSummary.description,
    title: loadingState.isLoading 
      ? 'Loading...' 
      : props.title, // Use the passed title as it's more reliable
    version: loadingState.isLoading 
      ? 'Loading...' 
      : apiDocSummary.version,
    createdDate: loadingState.isLoading 
      ? undefined
      : apiDocSummary.createdDate,
    createdBy: loadingState.isLoading 
      ? undefined
      : apiDocSummary.createdBy,
    onClick: loadingState.error ? undefined : onClick, // Disable click if there's an error
    hasError: !!loadingState.error,
    isLoading: loadingState.isLoading
  };

  return (
    <>
      <PureApiDocItem {...displayProps} />
    </>
  )
}
