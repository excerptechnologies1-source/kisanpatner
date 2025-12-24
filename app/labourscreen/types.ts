import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export interface Labourer {
    _id: string;
    name: string;
    villageName: string;
    contactNumber?: string;
    email?: string;
    workTypes?: string[];
    experience?: string;
    availability?: string;
    address?: string;
    todayAttendance?: 'present' | 'absent' | 'pending';
    gender?: 'male' | 'female';
}

export type RootStackParamList = {
    LabourList: undefined;
    AddLabour: undefined;
    LabourDetails: { id: string };
    AttendanceConfirmation: { assignmentId: string; labourer: Labourer };
};

export type NavigationProps<T extends keyof RootStackParamList> = {
    navigation: NativeStackNavigationProp<RootStackParamList, T>;
    route: RouteProp<RootStackParamList, T>;
};
