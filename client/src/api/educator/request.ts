import { url } from "@port-of-mars/client/util";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";
import {
  StudentAuthData,
  InspectData,
  StudentData,
  ActiveRoomData,
  ClassroomData,
  TeacherData,
} from "@port-of-mars/shared/types";

export class EducatorAPI {
  http: any;
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  private classroomUrl(path: string, classroomId: number): string {
    return url(`${path}?classroomId=${classroomId}`);
  }

  async authStudent(): Promise<StudentAuthData | void> {
    return await this.ajax.get(url("/educator/student"), ({ data }) => {
      return data;
    });
  }

  async confirmStudent(formData: { name: string }): Promise<void> {
    await this.ajax.post(
      url("/educator/confirm-student"),
      ({ data, status }) => {
        if (status === 200) {
          return data;
        } else {
          throw new Error(data.message || "Student confirmation failed");
        }
      },
      formData
    );
  }

  async createClassroom(descriptor: string): Promise<void> {
    const payload = { descriptor };
    console.log("Sending payload:", payload);
    return await this.ajax.post(
      url("/educator/classroom"),
      ({ data, status }) => {
        if (status === 201) {
          return data;
        } else {
          throw new Error(data.message || "Classroom creation failed");
        }
      },
      payload
    );
  }

  //FIXME: Services uses Promise<Classroom>
  async getClassrooms(): Promise<Array<ClassroomData>> {
    return await this.ajax.get(url("/educator/classrooms"), ({ data, status }) => {
      return data;
    });
  }

  async updateClassroom(classroomId: number, descriptor: string): Promise<void> {
    return await this.ajax.update(
      this.classroomUrl("/educator/classroom", classroomId),
      ({ data, status }) => {
        if (status !== 200) {
          throw new Error(data.message || "Classroom renaming failed");
        }
      },
      { descriptor }
    );
  }

  async deleteClassroom(classroomId: number): Promise<void> {
    return await this.ajax.delete(
      this.classroomUrl("/educator/classroom", classroomId),
      ({ data, status }) => {
        if (status !== 200) {
          throw new Error(data.message || "Classroom deletion failed");
        }
      }
    );
  }

  async startGames(classroomId: number): Promise<void> {
    return await this.ajax.post(
      this.classroomUrl("/educator/start-classroom-games", classroomId),
      ({ data, status }) => {
        if (status !== 200) {
          throw new Error(data.message || "games failed to start");
        }
      }
    );
  }

  async getClassroomGames(classroomId: number): Promise<Array<ActiveRoomData>> {
    return await this.ajax.get(
      this.classroomUrl("/educator/classroom-games", classroomId),
      ({ data, status }) => {
        return data;
      }
    );
  }

  async getInspectData(roomId: string): Promise<InspectData> {
    return await this.ajax.get(
      url(`/educator/inspect-room?roomId=${roomId}`),
      ({ data, status }) => {
        return data;
      }
    );
  }

  async getClassroomStudents(classroomId: number): Promise<Array<StudentData>> {
    return await this.ajax.get(
      this.classroomUrl("/educator/students", classroomId),
      ({ data, status }) => {
        return data;
      }
    );
  }

  async getLobbyClients(classroomId: number): Promise<Array<StudentData>> {
    return await this.ajax.get(
      this.classroomUrl("/educator/lobby-clients", classroomId),
      ({ data, status }) => {
        return data;
      }
    );
  }

  //Should there be a specific type for completed games?
  async getCompletedGames(classroomId: number): Promise<any> {
    return await this.ajax.get(
      this.classroomUrl("/educator/completed-games", classroomId),
      ({ data, status }) => {
        return data;
      }
    );
  }

  // Teacher-related methods
  async getTeachers(): Promise<Array<TeacherData>> {
    return await this.ajax.get(url("/educator/teacher/list"), ({ data, status }) => {
      return data;
    });
  }

  async addTeacher(teacherData: { email: string; username: string; name: string }): Promise<any> {
    const payload = { ...teacherData };
    return await this.ajax.post(
      url("/educator/teacher/add"),
      ({ data, status }) => {
        if (status === 201) {
          return data;
        } else {
          throw new Error(data.message || "Failed to add teacher");
        }
      },
      payload
    );
  }

  async deleteTeacher(teacherId: number): Promise<void> {
    return await this.ajax.delete(
      url(`/educator/teacher/delete/${teacherId}`),
      ({ data, status }) => {
        if (status !== 200) {
          throw new Error(data.message || "Failed to delete teacher");
        }
      }
    );
  }
}
