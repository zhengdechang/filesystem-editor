import { observable, action, makeObservable } from "mobx";
import { readDir, readFileAsBase64 } from "services/filesystem/localFilesystemService";

export enum CompilationStage {
    idle,
    uploading,
    firstPass,
    secondPass,
    results,
    finished
}

export type SpecialCompilationAction = "createUUID";

export interface RemoteCompilationResultResponse {
    data: {
        action?: SpecialCompilationAction;
        attributes?: {
            compilerVersion?: string;
            jobId?: string;
            output?: string;
            storyfile?: string;
        };
        report: string;
        success: boolean;
    };
    links?: {
        index: string;
        storyfile: string;
    }
}


/**
 * The results of a compilation – generated files, reports and compiler status
 */
class CompilationResultStore {
    // Files generated by the compiler
    artifacts: FilesystemFile[];

    // Compiler output as text
    compilerOutput: string;

    // URL to the (Inform 7) project index
    indexUrl: string | null;

    // Is the compiler currently running?
    isCompiling: boolean;

    // The completion percentage of the current stage of the compilation
    percentage: number | null;

    // The summary of compilation results
    resultsReport: string | null;

    // A special action available for the user
    specialAction: SpecialCompilationAction | null;

    // In multi-stage compilation, the stage that's currently running
    stage: CompilationStage;

    // The virtual filesystem path of the main compilation result (the story file)
    // that will be passed to the interpreter
    storyfileLocalPath: string | null;

    // If the compiler is an external service, this contains the URL to the
    // compilation result
    storyfileRemoteUrl: string | null;

    // Did the compilation finish successfully?
    success: boolean;


    /**
     * Set initial default values
     */
    constructor() {
        makeObservable( this, {
            artifacts: observable,
            compilerOutput: observable,
            indexUrl: observable,
            isCompiling: observable,
            percentage: observable,
            resultsReport: observable,
            specialAction: observable,
            stage: observable,
            storyfileLocalPath: observable,
            storyfileRemoteUrl: observable,
            success: observable,
            addToCompilerOutput: action,
            reset: action,
            setCompilationStatus: action,
            setCompilerOutput: action,
            setLocalResults: action,
            setPercentage: action,
            setRemoteResults: action,
            setStage: action
        });

        this.reset();
    }


    /*
     * The compiler calls this to add more text to the compiler output
     */
    addToCompilerOutput = ( output: string ): void => {
        this.compilerOutput += output;
    };


    /*
     * Get the resulting local story file's contents base64-encoded.
     * Most interpreters read base64-encoded story files.
     */
    public getBase64Storyfile = (): string | null => {
        if( !this.storyfileLocalPath ) {
            return null;
        }

        return readFileAsBase64( this.storyfileLocalPath );
    };


    /*
     * Reset values to defaults
     */
    reset = (): void => {
        this.artifacts = [];
        this.compilerOutput = "";
        this.indexUrl = null;
        this.isCompiling = false;
        this.percentage = null;
        this.resultsReport = null;
        this.stage = CompilationStage.idle;
        this.storyfileRemoteUrl = null;
        this.storyfileLocalPath = null;
        this.success = true;
    };


    /**
     * Toggles the compilation status
     */
    setCompilationStatus = ( status: boolean ): void => {
        this.isCompiling = status;
    };


    /*
     * Set the entire compiler output
     */
    setCompilerOutput = ( output: string ): void => {
        this.compilerOutput = output;
    };


    /*
     * When the compilation with a client-side compiler ends, save the results
     */
    setLocalResults = ({ storyfilePath = null, success }: { storyfilePath: string | null; success: boolean }): void => {
        this.artifacts = readDir( "/output" );
        this.storyfileLocalPath = storyfilePath;
        this.success = success;
        this.isCompiling = false;
        this.stage = CompilationStage.finished;
    };


    /*
     * Set the stage completion percentage
     */
    setPercentage = ( newPercentage: number ): void => {
        this.percentage = newPercentage;
    };


    /*
     * Same as setLocalResults but for an external compiler service
     */
    setRemoteResults = ({ data, links }: RemoteCompilationResultResponse ): void => {
        this.indexUrl = links ? links.index : null;
        this.storyfileRemoteUrl = links ? links.storyfile : null;
        this.resultsReport = data.report;
        this.success = data.success;
        this.isCompiling = false;
        this.specialAction = data.action || null;

        if( data.success ) {
            this.stage = CompilationStage.finished;
        }
    };


    /*
     * Change the compilation stage. Resets the completion percentage.
     */
    setStage = ( newStage: CompilationStage ): void => {
        if( this.stage === newStage ) {
            return;
        }

        this.stage = newStage;
        this.percentage = null;
    };
}

export default new CompilationResultStore();
