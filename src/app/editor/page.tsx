import { Toaster } from 'sonner';

import ShaderBackground from '@/components/ui/shader-background';

import { PlateEditor } from '@/components/editor/plate-editor';
import { Sidebar, SidebarBody } from '@/components/ui/sidebar';

const EditorSidebar = () => {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <div className="flex items-center space-x-2 py-4 px-2">
        <div className="h-6 w-7 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        <span className="font-medium text-black dark:text-white text-sm">
          Editor
        </span>
      </div>
    </div>
  );
};

export default function Page() {
  return (

      <div className="h-full w-full bg-gray-100 flex">  
        <ShaderBackground>    
        <div className="flex-1 flex items-center justify-center p-2 min-w-0">
          
            <Sidebar>
              <SidebarBody>
                <EditorSidebar />
              </SidebarBody>
            </Sidebar>
          
          <div className="w-full max-w-full bg-white rounded-md shadow-sm border border-gray-200 px-4 flex items-center justify-center">
            <div className="w-full max-w-6xl">
              <div className="h-full w-full overflow-auto p-2"></div>
              <PlateEditor />
              </div>
            </div>
          </div>
        <Toaster />
        </ShaderBackground>
      </div>
  );
}
