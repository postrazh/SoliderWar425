// Copyright 1998-2018 Epic Games, Inc. All Rights Reserved.

#include "SoldierWarGameMode.h"
#include "SoldierWarCharacter.h"
#include "UObject/ConstructorHelpers.h"

ASoldierWarGameMode::ASoldierWarGameMode()
{
	// set default pawn class to our Blueprinted character
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnBPClass(TEXT("/Game/ThirdPersonCPP/Blueprints/ThirdPersonCharacter"));
	if (PlayerPawnBPClass.Class != NULL)
	{
		DefaultPawnClass = PlayerPawnBPClass.Class;
	}
}
