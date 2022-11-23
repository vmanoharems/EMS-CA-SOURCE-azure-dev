SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertupdateMyDefault]
	-- Add the parameters for the stored procedure here
	@Type nvarchar(50),
	@UserType nvarchar(50),
	@RefId int,
	@Defvalue nvarchar(50),
	@UserId int,
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Mydefault(Type,UserType,RefId,Defvalue,UserId,ProdId)
	values(@Type,@UserType,@RefId,@Defvalue,@UserId,@ProdId)
END




GO