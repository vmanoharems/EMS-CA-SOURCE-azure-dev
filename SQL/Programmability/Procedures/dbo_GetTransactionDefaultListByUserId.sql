SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE  [dbo].[GetTransactionDefaultListByUserId]
	-- Add the parameters for the stored procedure here
@UserId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select TC.TransactionCodeID,TV.TransactionValueid,TV.TransValue From Mydefault M
	left outer join TransactionCode TC on m.RefId=tc.TransactionCodeID
	left outer join TransactionValue TV on tc.TransactionCodeID=tv.TransactionCodeID and m.Defvalue=tv.TransactionValueID 
	 where UserId=@UserId and Type='TransactionCode'
END



GO