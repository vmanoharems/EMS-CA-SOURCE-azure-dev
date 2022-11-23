SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateMyDefaultUserProfile]
    @Type nvarchar(50),
	@UserType nvarchar(50),
	@RefId int,
	@Defvalue nvarchar(50),
	@UserId int,
	@ProdId int

	AS
BEGIN

	SET NOCOUNT ON;

  	insert into Mydefault(Type,UserType,RefId,Defvalue,UserId,ProdId)
	values(@Type,@UserType,@RefId,@Defvalue,@UserId,@ProdId)	

END




GO