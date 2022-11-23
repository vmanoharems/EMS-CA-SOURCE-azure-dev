SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertRecipient]
	-- Add the parameters for the stored procedure here
	@RecipientId int,
	@VendorID int,
	@CoaId int,
	@Prodid int,
	@Createdby int,
	@CoaString nvarchar(300),
	@SetId int,
	@SeriesId int,
	@Status bit
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
	if(@RecipientId=0)
	begin
	insert into Recipient (VendorID,CoaId,Prodid,Createddate,Createdby,CoaString,SetId,SeriesId,Status)values
	(
	@VendorID,@CoaId,@Prodid,GETDATE(),@Createdby,@CoaString,@SetId,@SeriesId,1

	)
	set @RecipientId=SCOPE_IDENTITY()
	end
	else
	begin
	update Recipient  set Status=@Status 	where VendorID=@VendorID
	end
	select @RecipientId;
END



GO